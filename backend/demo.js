var loading = document.getElementById("loading");
loading.style.visibility='hidden';

function sendQuery() {
    loading.style.visibility='visible';
    let freezeClic = true;
    document.addEventListener("click", freezeClicFn, true);
    function freezeClicFn(e) {
      if (freezeClic) {
        
        e.stopPropagation();
        e.preventDefault();
      }
    }
    const qtype = document.getElementById("qtype").value;
    const query = document.getElementById("query").value;

    const data = {
        qtype: parseInt(qtype, 10),
        query: query
    };

    axios.post("http://127.0.0.1:6001/chat", data)
    .then(response => {
        if (data.qtype == 1){

        let displayText = `Answer: ${response.data[response.data.length - 1].answer} \n\n`;
        response.data.slice(0, -1).forEach(item => {
            let cleanedContent = item.document.page_content.replace(/\n/g, ' ').replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);             displayText += `Page Content: ${cleanedContent}\n`;

            const match = item.document.metadata.source.match(/FI(\d+)_([^_]+)(?:_(\d+))?\.pdf$/);
            console.log(match)
            if (match) {
                const bibid = match[1];
                const vid = match[2];
                const url = `http://dpanther.fiu.edu/dpanther/items/itemdetail?bibid=FI${bibid}&vid=${vid}`;
                displayText += `Source: <a href="${url}" target="_blank">${url}</a>\n`;
            } else {
                displayText += `Source: ${item.document.metadata.source}\n`;
            }
            displayText += `Page: ${item.document.metadata.page}\n`;
        });
        document.getElementById("response").innerHTML = displayText;
        }
        else {
        let displayText = ``;
        response.data.forEach(item => {
            let cleanedContent = item.document.page_content.replace(/\n/g, ' ').replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);             displayText += `Page Content: ${cleanedContent}\n`;
            
            const match = item.document.metadata.source.match(/FI(\d+)_([^_]+)(?:_(\d+))?\.pdf$/);
            console.log(match)
            if (match) {
                const bibid = match[1];
                const vid = match[2];
                const url = `http://dpanther.fiu.edu/dpanther/items/itemdetail?bibid=FI${bibid}&vid=${vid}`;
                displayText += `Source: <a href="${url}" target="_blank">${url}</a>\n`;
            } else {
                displayText += `Source: ${item.document.metadata.source}\n`;
            }
            displayText += `Page: ${item.document.metadata.page}\n`;
            displayText += `Score: ${item.score}\n\n`;
        });
        document.getElementById("response").innerHTML = displayText;
        }
        freezeClic = false; 
        loading.style.visibility='hidden';
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}