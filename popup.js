const btn = document.querySelector('.ChangeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');


//open popup
btn.addEventListener('click', async () => {
    // console.log('clicked');

    //calling back static storage from background.js
    const color=chrome.storage.sync.get('color',({color})=>{
        console.log('color: ', color);
    })
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // console.log(tab);
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: pickColor,
    }, async (injectionResults) => { //callback result returned from pickColor
        const [data] = injectionResults;
        if (data.result) {
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color;
            colorValue.innerText = color;
            try {
                await navigator.clipboard.writeText(color); //using navigator API  from browser copy color value to clipboard    
            } catch (error) {
                console.error(error);
            }

        }
        console.log(injectionResults);

    });


});

async function pickColor() {
    // console.log('Script working');
    try {
        //Activate picker
        const eyeDropper = new EyeDropper(); //eye dropper object from API
        return await eyeDropper.open();
        // console.log(selectedColor);

    } catch (err) {
        console.error(err);
    }
}