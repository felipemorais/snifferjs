;(function(w){
    function sniffer(dependencies, func, timeout){
        this.timeout = timeout || 10000;
        this.interval = 1000;
        this.status = 'waiting';
        this.onTimeout = function(){};
        if(typeof dependencies == "function"){
            this.dependencies = [];
            this.func = dependencies;
        }else{
            this.dependencies = (typeof dependencies == "string") ? [dependencies] : dependencies;
            this.func = func;
        }
        this.typeDependency = typeof dependencies;
        this.check();
    }
    sniffer.prototype = {
        getDependencyFromException : function(e){
            console.log(e);
            if(e.arguments){
                return e.arguments[0];
            }else if(e.message){
                e = e.message.toString();
                e = e.substring(e.indexOf("'")+1);
                return e.substring(0,e.indexOf("'"));
            }else if(e.indexOf("ReferenceError")===0){
                e = e.substring(e.indexOf(" ")+1);
                return e.substring(0,e.indexOf(" "));
            } 
            return false;
        },
        validDepencies : function(){
            var toValidate = this.dependencies;
            if(toValidate.length){
                for(var i=0;i<toValidate.length;i++){
                    if(window[toValidate[i]] === undefined){
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        check : function(){
            this.timeout = this.timeout - this.interval;
            var _this = this;
            if(this.dependencies.length==0 || this.validDepencies()){
               try{
                    _this.status = 'ready';
                    _this.func.call(this);
                }catch(e){
                    //injeta dependencia se detectar
                    var dependency = _this.getDependencyFromException(e);
                    if(dependency){
                        _this.dependencies.push(dependency);
                        _this.check();
                    }
                }
            }else if(this.timeout > 0){
                var _this = this;
                setTimeout(function(){_this.check();},_this.interval);
            }else{
                this.status = 'timeout';
                this.onTimeout.call(this);
            }
        }
    };
    w.sniffer = sniffer;
})(this);