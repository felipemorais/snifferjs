;(function(window, undefined){
	function startTest(){
		teste1 = undefined;
		teste2 = undefined;
		teste3 = undefined;
		snif = undefined;
		
	}
	module("Sem dependencias");
	asyncTest('Sniffer sem dependencias', 1, function(){
		setTimeout(function(){
			startTest();
			var snif = new sniffer(function(){
				QUnit.equal(this.status, 'ready', 'executado.');
				start();
			});
		},10);
	});
	
	module("Com dependencias");
	asyncTest('Sniffer com dependencia em string', 3, function(){
		setTimeout(function(){
			startTest();
			QUnit.equal(window.teste1, undefined, 'dependencia teste nao existe.');
			setTimeout(function(){teste1=true;},5000);			
			var snif = new sniffer('teste1',function(){
				QUnit.equal(window.teste1, true, 'dependencia teste existe.');
				QUnit.equal(this.status,'ready', 'executou antes do timeout.');
				start();
			});
		},10);
	});
	test('Sniffer com dependencia em array', 6, function(){
		stop(2);
		setTimeout(function(){
			startTest();
			QUnit.equal(window.teste1, undefined, 'variavel teste1 nao existe.');
			QUnit.equal(window.teste2, undefined, 'variavel teste2 nao existe.');
			
			var ev = setTimeout(function(){teste1 =true; teste2=true;},5000);
		
			var snif = new sniffer(['teste1','teste2'],function(){
				QUnit.equal(window.teste1, true, 'teste1 existe');
				QUnit.equal(window.teste2, true, 'teste2 existe');
				QUnit.equal(this.status, 'ready', 'executou antes do timeout.');
				clearTimeout(ev);
				start();
			});
			setTimeout(function(){
				QUnit.notEqual(snif.status,'timeout','nao disparou timeout.');
				start();
			},10000);
		},10)
	});

	module("Timeout")
	asyncTest('Sniffer com dependencia timeout', 3, function(){
		setTimeout(function(){
			startTest();
			QUnit.equal(window.teste1, undefined, 'variavel teste2 nao existe.');
			var snif = new sniffer('teste1',function(){});
			snif.onTimeout = function(){
				QUnit.equal(window.teste1, undefined, 'variavel teste2 nao existe.');
				QUnit.equal(this.status,'timeout','timeout executado.');
				start();
			};
		},10)
	});
	asyncTest('Verifica timeout do sniffer usando array', 3, function(){
		setTimeout(function(){
			startTest();
			QUnit.equal(window.teste1, undefined, 'variavel teste1 nao existe.');
			QUnit.equal(window.teste2, undefined, 'variavel teste2 nao existe.');
			setTimeout(function(){teste1=true;},5000);
			var snif = new sniffer(['teste1','teste2'],function(){});
			snif.onTimeout = function(){
				QUnit.equal(snif.status,'timeout','disparou timeout.');
				start();
			};
		},10)
	});

	module("Automatizacao de dependencia");
	test('Verifica controle de dependencia automatica do sniffer usando funcao de autoexecusao', 3, function(){
		stop(2);
		setTimeout(function(){
			startTest();
			QUnit.equal(window.teste3, undefined, 'variavel teste3 nao existe.');

			setTimeout(function(){teste3=true;},5000);
		
			var snif = new sniffer(function(){
				QUnit.equal(teste3, true, 'teste3 existe');
				QUnit.equal(this.status, 'ready', 'executou antes do timeout.');
				start();
			});
			setTimeout(function(){
				QUnit.notEqual(snif.status,'timeout','nao disparou timeout.');
				start();
			},10000);
		},10)
	});
    test('Verifica controle de dependencia automatica do sniffer usando array', 10, function(){
		stop(2);
		setTimeout(function(){
			startTest();
			QUnit.equal(window.teste1, undefined, 'variavel teste1 nao existe.');
			QUnit.equal(window.teste2, undefined, 'variavel teste2 nao existe.');
			QUnit.equal(window.teste3, undefined, 'variavel teste3 nao existe.');

			setTimeout(function(){teste1 = teste2=true;},5000);
			setTimeout(function(){teste3=true;},7000);
		
			var snif = new sniffer(['teste1','teste2'],function(){
				QUnit.equal(teste1, true, 'teste1 existe');
				QUnit.equal(teste2, true, 'teste2 existe');
				if(window.teste3){
					QUnit.equal(teste3, true, 'teste3 existe');
				}
				
				QUnit.equal(this.status, 'ready', 'executou antes do timeout.');
				start();
			});
			setTimeout(function(){
				QUnit.notEqual(snif.status,'timeout','nao disparou timeout.');
				start();
			},10000);
		},10)
	});
	
}(this));