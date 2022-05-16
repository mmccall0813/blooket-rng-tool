( () => { // anon function, makes defined variables not go into global scope
    
    class RNGManip {
        #callback;
        #spoof;
        #spoofedRandom;
        #oldRandom;
        constructor() {
           this.#oldRandom = Math.random;
           this.#spoofedRandom = 0;
           this.#callback = null; // call this function when a random number is generated or spoofed
           this.#spoof = false;
    
           Math.random = () => {
               var rand = this.#spoof ? this.#spoofedRandom : this.#oldRandom();
               if(typeof this.#callback === "function") this.#callback(rand);
               return rand;
           }
        }
        setSpoofedRandom(random) {
           this.#spoofedRandom = random;
        }
        setCallback(callback) {
           if(typeof callback !== 'function') throw new Error('Callback must be a function');
           this.#callback = callback;
        }
        setEnabled(enabled) {
           if(typeof enabled !== 'boolean') throw new Error('called setEnabled with non-boolean value');
           this.#spoof = enabled;
       }
    }
    
    const rngManip = new RNGManip();
    const iframe = document.createElement('iframe');
    iframe.style.border = "none";
    var frame = document.body.appendChild(iframe);
    var contentWindow = frame.contentWindow;
    var codes = contentWindow.prompt("Enter your RNG codes, if you dont have any, get them from the generator on the GitHub page.");
    /*
    Codes Example:

   [
      {
        "triggerElement": "[class^='styles__feedbackContainer___'] > div",
        "numbers": [0.4267, 0.4267, 0.5123]
      }
   ]

    */
   codes = JSON.parse(codes)
   document.body.removeChild(frame);
   setInterval( () => {
      codes.forEach( (code) => {
         var triggerElem = document.querySelector(code.triggerElement);
         const numbers = code.numbers;
         var index = 0;
         if(triggerElem !== null){
            rngManip.setEnabled(true);
            rngManip.setSpoofedRandom(numbers[index++]);
            rngManip.setCallback( () => {
               if(index == numbers.length) return rngManip.setEnabled(false);
               rngManip.setSpoofedRandom(numbers[index++]);
            });
            triggerElem.click();
         }
      })
   }, 250)
})()