//run this in console on Google Form page to get the entry IDs for each field on form.

function loop(e){
  if(e.children)
      for(let i=0;i<e.children.length;i++){
          let c = e.children[i], n = c.getAttribute('name');
          if(n) console.log(`${c.getAttribute('aria-label')}: ${n}`);
          loop(e.children[i]);
       }
  }; loop(document.body);