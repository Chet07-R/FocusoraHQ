const nav = document.querySelector('.navbar')
const bottom = document.querySelector('.footer')    
fetch('./navbar.html')
.then(res => res.text())
.then(data =>{
    nav.innerHTML = data
    initNavbar();
    const parser = new DOMParser();   // this is is the file we are including also has a javacript included in it
    const doc = parser.parseFromString(data, 'text/html');  // this will accept two parameters and text/html - type of content we need
    eval(doc.querySelector('script').textContent)  // eval will execute if the content is js 
})

fetch('./footer.html')
.then(res => res.text())
.then(data =>{
    bottom.innerHTML = data
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');  
    eval(doc.querySelector('script').textContent)  
})