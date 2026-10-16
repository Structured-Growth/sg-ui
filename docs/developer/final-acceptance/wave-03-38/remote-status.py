import urllib.request, urllib.error, datetime, json, pathlib
out=pathlib.Path(__file__).parent
urls={'npm':'https://registry.npmjs.org/@structured-growth%2fsg-ui','githubTags':'https://api.github.com/repos/Structured-Growth/sg-ui/tags?per_page=100','githubReleases':'https://api.github.com/repos/Structured-Growth/sg-ui/releases?per_page=100'}
result={'observedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'authentication':'none; public GET only','observations':{}}
for name,url in urls.items():
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'sgui-readonly-acceptance','Accept':'application/json'}), timeout=15) as r:
   body=r.read(); data=json.loads(body)
   result['observations'][name]={'url':url,'status':r.status,'data':({'name':data.get('name'),'dist-tags':data.get('dist-tags'),'versions':list(data.get('versions',{}))} if name=='npm' else [{'name':v.get('name'),'tag_name':v.get('tag_name'),'target_commitish':v.get('target_commitish'),'sha':v.get('commit',{}).get('sha'),'url':v.get('html_url')} for v in data]),'link':r.headers.get('Link')}
 except urllib.error.HTTPError as e:
  result['observations'][name]={'url':url,'status':e.code,'interpretation':'Public endpoint response only; 404 does not prove private repository/package absence or owner permissions.'}
 except Exception as e:
  result['observations'][name]={'url':url,'error':str(e),'interpretation':'Unknown, do not infer absence.'}
(out/'remote-status.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
