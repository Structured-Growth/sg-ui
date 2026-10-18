"use client";
import {useEffect,useRef,useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useLexicalEditable} from "@lexical/react/useLexicalEditable";
import {$createTableSelectionFrom,$isTableCellNode,$isTableNode,TableNode} from "@lexical/table";
import {$findMatchingParent} from "@lexical/utils";
import {$getNearestNodeFromDOMNode,$getNodeByKey,$nodesOfType,$setSelection,getNearestEditorFromDOMNode,type NodeKey} from "lexical";
import {Button} from "../../Button/Button";
import {Typography} from "../../../experimental/Typography/Typography";
import {useTranslation} from "../../../i18n";

/** Two ordinary clicks create the same rectangle as Lexical's table-cell drag. */
export function TableCellSelectionPlugin() {
  const [editor]=useLexicalComposerContext(),editable=useLexicalEditable();
  const {t}=useTranslation();
  const [hasTable,setHasTable]=useState(false),[phase,setPhase]=useState<'off'|'start'|'end'>('off');
  const armed=phase!=='off';
  const anchor=useRef<NodeKey|null>(null);
  useEffect(()=>{
    // Registered containers can own same-editor tables below the document root.
    const refresh=()=>setHasTable(editor.getEditorState().read(()=>$nodesOfType(TableNode).some(table=>table.isAttached())));
    refresh();
    return editor.registerUpdateListener(refresh);
  },[editor]);
  useEffect(()=>{
    anchor.current=null;
    if(!editable||!hasTable){setPhase('off');return;}
    if(!armed)return;
    const root=editor.getRootElement();
    if(!root)return;
    const isCell=(event:Event)=>{
      const target=event.target,view=root.ownerDocument.defaultView;
      return view&&target instanceof view.Element&&target.closest('td,th')&&getNearestEditorFromDOMNode(target)===editor;
    };
    const down=(event:PointerEvent)=>{if(event.button===0&&isCell(event)){event.preventDefault();event.stopPropagation();}};
    const click=(event:MouseEvent)=>{
      if(event.button!==0||!isCell(event))return;
      event.preventDefault();event.stopPropagation();
      // Cell pointerdown prevents native focus; keyboard cancellation belongs to this root.
      root.focus({preventScroll:true});
      editor.update(()=>{
        const node=$getNearestNodeFromDOMNode(event.target as Node);
        const cell=node&&$findMatchingParent(node,$isTableCellNode);
        const table=cell&&$findMatchingParent(cell,$isTableNode);
        if(!$isTableCellNode(cell)||!$isTableNode(table))return;
        const previous=anchor.current?$getNodeByKey(anchor.current):null;
        const sameTable=$isTableCellNode(previous)&&$findMatchingParent(previous,$isTableNode)?.getKey()===table.getKey();
        $setSelection($createTableSelectionFrom(table,sameTable?previous:cell,cell));
        if(sameTable){anchor.current=null;setPhase('off');}
        else {anchor.current=cell.getKey();setPhase('end');}
      });
    };
    const cancel=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setPhase('off');}};
    root.addEventListener('pointerdown',down,true);
    root.addEventListener('click',click,true);
    root.addEventListener('keydown',cancel,true);
    return ()=>{
      root.removeEventListener('pointerdown',down,true);
      root.removeEventListener('click',click,true);
      root.removeEventListener('keydown',cancel,true);
    };
  },[editor,editable,hasTable,armed]);
  if(!editable||!hasTable)return null;
  return <div>
    <Button variant="outlined" tone="neutral" aria-pressed={phase!=='off'} onPress={()=>setPhase(phase==='off'?'start':'off')}>{t('editor.selectTableCells',{defaultMessage:'Select table cells'})}</Button>
    {phase!=='off'&&<Typography role="status" variant="body2">{phase==='start'?t('editor.selectFirstTableCell',{defaultMessage:'Choose the first cell, then the last cell of the range. Select table cells again or press Escape to cancel.'}):t('editor.selectLastTableCell',{defaultMessage:'Choose the last cell of the range.'})}</Typography>}
  </div>;
}
