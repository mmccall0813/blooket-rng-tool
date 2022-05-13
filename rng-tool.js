( () => { // anon functinon, makes defined variables not go into global scope.
    
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
    var frame = document.body.appendChild(document.createElement("iframe"))
    var contentWindow = frame.contentWindow;
    var codes = contentWindow.prompt("Enter your RNG codes, if you dont have any, get them from the github page, or use the tool.");
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
   setInterval( () => {
      codes.forEach( (code) => {
         var triggerElem = document.querySelector(code.triggerElement);
         var numbers = code.numbers;
         var index = 0;
         console.log(code)
         if(triggerElem !== null){
            rngManip.setEnabled(true);
            rngManip.setSpoofedRandom(numbers.shift());
            rngManip.setCallback( () => {
               if(numbers.length == 0) return rngManip.setEnabled(false);
               rngManip.setSpoofedRandom(numbers.shift());
               debugger;
            });
            triggerElem.click();
         }
      })
   }, 250)
})()