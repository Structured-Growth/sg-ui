// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {act,cleanup,render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import {$createTableNodeWithDimensions,$isTableSelection,TableNode,TableRowNode,TableCellNode} from '@lexical/table';
import {$getRoot,$getSelection,type LexicalEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {TableCellSelectionPlugin} from './TableCellSelectionPlugin';
import {EXPERIENCE_EDITOR_THEME} from './editorConfig';
import {EXPERIENCE_EDITOR_NODES} from './editorConfig';
import {$createQuoteNode} from '@lexical/rich-text';
import {prepareEditorDocument} from './prepareEditorDocument';
let editor:LexicalEditor;
function Capture(){[editor]=useLexicalComposerContext();return null;}
afterEach(cleanup);

it('selects the drag-equivalent table rectangle with two clicks, cancels and respects read-only',async()=>{
  const user=userEvent.setup();
  const {container}=render(<LexicalComposer initialConfig={{namespace:'table-pointer-alternative',theme:EXPERIENCE_EDITOR_THEME,nodes:[TableNode,TableRowNode,TableCellNode],onError:error=>{throw error;},editorState:()=>{$getRoot().append($createTableNodeWithDimensions(2,2));}}}>
    <RichTextPlugin contentEditable={<ContentEditable aria-label="Document"/>} placeholder={null} ErrorBoundary={LexicalErrorBoundary}/>
    <TablePlugin/><TableCellSelectionPlugin/><Capture/>
  </LexicalComposer>);
  await waitFor(()=>expect(screen.getByRole('button',{name:'Select table cells'})).toBeTruthy());
  const cells=container.querySelectorAll('td,th');
  await user.click(screen.getByRole('button',{name:'Select table cells'}));
  await user.click(cells[0]);
  await waitFor(()=>expect(screen.getByRole('status').textContent).toBe('Choose the last cell of the range.'));
  await user.click(cells[3]);
  await waitFor(()=>expect(screen.queryByRole('status')).toBeNull());
  await waitFor(()=>expect(container.querySelectorAll('.editor-table-cell-selected')).toHaveLength(4));
  editor.getEditorState().read(()=>{
    const selection=$getSelection();expect($isTableSelection(selection)).toBe(true);
    if($isTableSelection(selection))expect(selection.getShape()).toEqual({fromX:0,fromY:0,toX:1,toY:1});
  });
  await user.click(screen.getByRole('button',{name:'Select table cells'}));
  await user.click(cells[0]);
  expect(document.activeElement).toBe(screen.getByRole('textbox'));
  await user.keyboard('{Escape}');
  expect(screen.getByRole('button',{name:'Select table cells'}).getAttribute('aria-pressed')).toBe('false');
  await act(async()=>editor.setEditable(false));
  expect(screen.queryByRole('button',{name:'Select table cells'})).toBeNull();
  await act(async()=>editor.setEditable(true));
  expect(screen.getByRole('button',{name:'Select table cells'}).getAttribute('aria-pressed')).toBe('false');
});

it('offers the same selection for an admitted table inside a supported quote container',async()=>{
  const user=userEvent.setup();
  const {container}=render(<LexicalComposer initialConfig={{namespace:'quoted-table-pointer-alternative',theme:EXPERIENCE_EDITOR_THEME,nodes:EXPERIENCE_EDITOR_NODES,onError:error=>{throw error;},editorState:()=>{$getRoot().append($createQuoteNode().append($createTableNodeWithDimensions(2,2)));}}}>
    <RichTextPlugin contentEditable={<ContentEditable aria-label="Document"/>} placeholder={null} ErrorBoundary={LexicalErrorBoundary}/>
    <TablePlugin/><TableCellSelectionPlugin/><Capture/>
  </LexicalComposer>);
  await waitFor(()=>expect(container.querySelector('blockquote table')).toBeTruthy());
  const saved=editor.getEditorState().toJSON();
  expect(saved.root.children[0].type).toBe('quote');
  expect(prepareEditorDocument(saved)).not.toBeNull();
  await user.click(await screen.findByRole('button',{name:'Select table cells'}));
  const cells=container.querySelectorAll('blockquote td,blockquote th');
  await user.click(cells[0]);
  await waitFor(()=>expect(screen.getByRole('status').textContent).toBe('Choose the last cell of the range.'));
  await user.click(cells[3]);
  await waitFor(()=>expect(container.querySelectorAll('.editor-table-cell-selected')).toHaveLength(4));
  editor.getEditorState().read(()=>{
    const selection=$getSelection();expect($isTableSelection(selection)).toBe(true);
    if($isTableSelection(selection))expect(selection.getShape()).toEqual({fromX:0,fromY:0,toX:1,toY:1});
  });
});
