YUI.add("event-custom",function(F){(function(){F.Env.evt={handles:{},plugins:{}};})();(function(){var G=0,H=1;F.Do={objs:{},before:function(J,L,M,N){var K=J,I;if(N){I=[J,N].concat(F.Array(arguments,4,true));K=F.rbind.apply(F,I);}return this._inject(G,K,L,M);},after:function(J,L,M,N){var K=J,I;if(N){I=[J,N].concat(F.Array(arguments,4,true));K=F.rbind.apply(F,I);}return this._inject(H,K,L,M);},_inject:function(I,K,L,N){var O=F.stamp(L),M,J;if(!this.objs[O]){this.objs[O]={};}M=this.objs[O];if(!M[N]){M[N]=new F.Do.Method(L,N);L[N]=function(){return M[N].exec.apply(M[N],arguments);};}J=O+F.stamp(K)+N;M[N].register(J,K,I);return new F.EventHandle(M[N],J);},detach:function(I){if(I.detach){I.detach();}},_unload:function(J,I){}};F.Do.Method=function(I,J){this.obj=I;this.methodName=J;this.method=I[J];this.before={};this.after={};};F.Do.Method.prototype.register=function(J,K,I){if(I){this.after[J]=K;}else{this.before[J]=K;}};F.Do.Method.prototype._delete=function(I){delete this.before[I];delete this.after[I];};F.Do.Method.prototype.exec=function(){var K=F.Array(arguments,0,true),L,J,O,M=this.before,I=this.after,N=false;for(L in M){if(M.hasOwnProperty(L)){J=M[L].apply(this.obj,K);if(J){switch(J.constructor){case F.Do.Halt:return J.retVal;case F.Do.AlterArgs:K=J.newArgs;break;case F.Do.Prevent:N=true;break;default:}}}}if(!N){J=this.method.apply(this.obj,K);}for(L in I){if(I.hasOwnProperty(L)){O=I[L].apply(this.obj,K);if(O&&O.constructor==F.Do.Halt){return O.retVal;}else{if(O&&O.constructor==F.Do.AlterReturn){J=O.newRetVal;}}}}return J;};F.Do.AlterArgs=function(J,I){this.msg=J;this.newArgs=I;};F.Do.AlterReturn=function(J,I){this.msg=J;this.newRetVal=I;};F.Do.Halt=function(J,I){this.msg=J;this.retVal=I;};F.Do.Prevent=function(I){this.msg=I;};F.Do.Error=F.Do.Halt;})();(function(){F.EventFacade=function(H,G){H=H||{};this.details=H.details;this.type=H.type;this.target=H.target;this.currentTarget=G;this.relatedTarget=H.relatedTarget;this.stopPropagation=function(){H.stopPropagation();};this.stopImmediatePropagation=function(){H.stopImmediatePropagation();};this.preventDefault=function(){H.preventDefault();};this.halt=function(I){H.halt(I);};};})();var C="_event:onsub",E="after",B=["broadcast","bubbles","context","configured","currentTarget","defaultFn","details","emitFacade","fireOnce","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],A=new F.EventFacade(),D=9;F.EventHandle=function(G,H){this.evt=G;this.sub=H;};F.EventHandle.prototype={detach:function(){if(this.evt){this.evt._delete(this.sub);}}};F.CustomEvent=function(G,H){H=H||{};this.id=F.stamp(this);this.type=G;this.context=F;this.logSystem=(G=="yui:log");this.broadcast=0;this.silent=this.logSystem;this.queuable=false;this.subscribers={};this.afters={};this.fired=false;this.fireOnce=false;this.stopped=0;this.prevented=0;this.host=null;this.defaultFn=null;this.stoppedFn=null;this.preventedFn=null;this.preventable=true;this.bubbles=true;this.signature=D;this.hasSubscribers=false;this.hasAfters=false;this.emitFacade=false;this.applyConfig(H,true);this.log("Creating "+this.type);if(G!==C){this.subscribeEvent=new F.CustomEvent(C,{context:this,silent:true});}};F.CustomEvent.prototype={_YUI_EVENT:true,applyConfig:function(H,G){if(H){F.mix(this,H,G,B);}},_on:function(K,I,H,G){if(!K){F.error("Invalid callback for CE: "+this.type);}var L=this.subscribeEvent,J;if(L){L.fire.apply(L,H);}J=new F.Subscriber(K,I,H,G);if(this.fireOnce&&this.fired){F.later(0,this,this._notify,J);}if(G==E){this.afters[J.id]=J;this.hasAfters=true;}else{this.subscribers[J.id]=J;this.hasSubscribers=true;}return new F.EventHandle(this,J);},subscribe:function(H,G){return this._on(H,G,arguments,true);},on:function(H,G){return this._on(H,G,arguments,true);},after:function(H,G){return this._on(H,G,arguments,E);},detach:function(K,I){if(K&&K.detach){return K.detach();}if(!K){return this.unsubscribeAll();}var L=false,H=this.subscribers,G,J;for(G in H){if(H.hasOwnProperty(G)){J=H[G];if(J&&J.contains(K,I)){this._delete(J);L=true;}}}return L;},unsubscribe:function(){return this.detach.apply(this,arguments);},_getFacade:function(){var G=this._facade,J,H=this.details,I;if(!G){G=new F.EventFacade(this,this.currentTarget);}J=H&&H[0];if(F.Lang.isObject(J,true)){I={};F.mix(I,G,true,A);F.mix(G,J,true);F.mix(G,I,true);}G.details=this.details;G.target=this.target;G.currentTarget=this.currentTarget;G.stopped=0;G.prevented=0;this._facade=G;return this._facade;},_notify:function(K,I,G){this.log(this.type+"->"+": "+K);var H,J;if(this.emitFacade){if(!G){G=this._getFacade(I);if(F.Lang.isObject(I[0])){I[0]=G;}else{I.unshift(G);}}}H=K.notify(J||this.context,I,this);if(false===H||this.stopped>1){this.log(this.type+" cancelled by subscriber");return false;}return true;},log:function(H,G){if(!this.silent){}},fire:function(){var P=F.Env._eventstack,I,R,O,J,K,G,L,H,M,N=true,Q;if(P){if(this.queuable&&this.type!=P.next.type){this.log("queue "+this.type);P.queue.push([this,arguments]);return true;}}else{F.Env._eventstack={id:this.id,next:this,silent:this.silent,logging:(this.type==="yui:log"),stopped:0,prevented:0,queue:[]};P=F.Env._eventstack;}if(this.fireOnce&&this.fired){this.log("fireOnce event: "+this.type+" already fired");}else{O=F.Array(arguments,0,true);this.stopped=0;this.prevented=0;this.target=this.target||this.host;Q=new F.EventTarget({fireOnce:true,context:this.host});this.events=Q;if(this.preventedFn){Q.on("prevented",this.preventedFn);}if(this.stoppedFn){Q.on("stopped",this.stoppedFn);}this.currentTarget=this.host||this.currentTarget;this.fired=true;this.details=O.slice();this.log("Firing "+this.type);M=false;P.lastLogState=P.logging;K=null;if(this.emitFacade){this._facade=null;K=this._getFacade(O);if(F.Lang.isObject(O[0])){O[0]=K;}else{O.unshift(K);}}if(this.hasSubscribers){I=F.merge(this.subscribers);for(J in I){if(I.hasOwnProperty(J)){if(!M){P.logging=(P.logging||(this.type==="yui:log"));M=true;}if(this.stopped==2){break;}R=I[J];if(R&&R.fn){N=this._notify(R,O,K);if(false===N){this.stopped=2;
}}}}}P.logging=(P.lastLogState);if(this.bubbles&&this.host&&!this.stopped){P.stopped=0;P.prevented=0;N=this.host.bubble(this);this.stopped=Math.max(this.stopped,P.stopped);this.prevented=Math.max(this.prevented,P.prevented);}if(this.defaultFn&&!this.prevented){this.defaultFn.apply(this.host||this,O);}if(!this.stopped&&this.broadcast){if(this.host!==F){F.fire.apply(F,O);}if(this.broadcast==2){F.Global.fire.apply(F.Global,O);}}if(this.hasAfters&&!this.prevented&&this.stopped<2){I=F.merge(this.afters);for(J in I){if(I.hasOwnProperty(J)){if(!M){P.logging=(P.logging||(this.type==="yui:log"));M=true;}if(this.stopped==2){break;}R=I[J];if(R&&R.fn){N=this._notify(R,O,K);if(false===N){this.stopped=2;}}}}}}if(P.id===this.id){L=P.queue;while(L.length){G=L.pop();H=G[0];P.stopped=0;P.prevented=0;P.next=H;N=H.fire.apply(H,G[1]);}F.Env._eventstack=null;}return(N!==false);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},detachAll:function(){var I=this.subscribers,H,G=0;for(H in I){if(I.hasOwnProperty(H)){this._delete(I[H]);G++;}}this.subscribers={};return G;},_delete:function(G){if(G){delete G.fn;delete G.context;delete this.subscribers[G.id];delete this.afters[G.id];}},toString:function(){return this.type;},stopPropagation:function(){this.stopped=1;F.Env._eventstack.stopped=1;this.events.fire("stopped",this);},stopImmediatePropagation:function(){this.stopped=2;F.Env._eventstack.stopped=2;this.events.fire("stopped",this);},preventDefault:function(){if(this.preventable){this.prevented=1;F.Env._eventstack.prevented=1;this.events.fire("prevented",this);}},halt:function(G){if(G){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();}};F.Subscriber=function(I,H,G){this.fn=I;this.context=H;this.id=F.stamp(this);this.wrappedFn=I;this.events=null;if(H){this.wrappedFn=F.rbind.apply(F,G);}};F.Subscriber.prototype={notify:function(G,I,L){var M=this.context||G,H=true,J=function(){switch(L.signature){case 0:H=this.fn.call(M,L.type,I,this.context);break;case 1:H=this.fn.call(M,I[0]||null,this.context);break;default:H=this.wrappedFn.apply(M,I||[]);}};if(F.config.throwFail){J.call(this);}else{try{J.call(this);}catch(K){F.error(this+" failed: "+K.message,K);}}return H;},contains:function(H,G){if(G){return((this.fn==H)&&this.context==G);}else{return(this.fn==H);}},toString:function(){return"Subscriber "+this.id;}};(function(){var G=F.Lang,J=":",K="~AFTER~",I={},M={},N=function(L,R){var Q=R,S=L._yuievt.config.prefix,P=S+Q;if(!G.isString(R)){return R;}else{if(I[P]){return I[P];}}if(Q.indexOf(J)==-1&&S){Q=S+J+Q;}I[P]=Q;return Q;},H=function(L,S){var R=S,Q=L._yuievt.config.prefix+R,U,T,V,P;if(!G.isString(S)){return S;}else{if(M[Q]){return M[Q];}}P=R.indexOf(K);if(P>-1){V=true;R=R.substr(K.length);}U=R.split(/[,|]\s*/);if(U.length>1){T=U[0];R=U[1];}R=N(L,R);M[Q]=[T,R,V];return M[Q];},O=function(L){var P=(G.isObject(L))?L:{};this._yuievt={id:F.guid(),events:{},targets:{},config:P,chain:("chain" in P)?P.chain:F.config.chain,defaults:{context:P.context||this,host:this,emitFacade:P.emitFacade,fireOnce:P.fireOnce,queuable:P.queuable,broadcast:P.broadcast,bubbles:("bubbles" in P)?P.bubbles:true}};};O.prototype={on:function(Z,a,Q){var S=H(this,Z),V,Y,X,W,R,L,U,b=F.Env.evt.handles,d,P,T;if(G.isObject(Z,true)){V=a;Y=Q;X=F.Array(arguments,0,true);W={};P=Z._after;delete Z._after;F.each(Z,function(e,c){if(e){V=e.fn||((F.Lang.isFunction(e))?e:V);Y=e.context||Y;}X[0]=(P)?K+c:c;X[1]=V;X[2]=Y;W[c]=this.on.apply(this,X);},this);return(this._yuievt.chain)?this:W;}else{if(G.isFunction(Z)){return F.Do.before.apply(F.Do,arguments);}}L=S[0];Z=S[1];P=S[2];if(this instanceof YUI){T=F.Env.evt.plugins[Z];if(T&&T.on){return T.on.apply(F,arguments);}else{if(!T&&Z.indexOf(":")==-1){return F.Event.attach.apply(F.Event,arguments);}}}R=this._yuievt.events[Z]||this.publish(Z);X=F.Array(arguments,1,true);V=(S[2])?R.after:R.on;U=V.apply(R,X);if(L){d=S[0]+S[1];if(!b[d]){b[d]=[];}b[d].push(U);}return(this._yuievt.chain)?this:U;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(X,Y,Q){var S=H(this,X),L=G.isArray(S)?S[0]:null,Z,P,V,U,a=this._yuievt.events,R,T,W=true;if(L){Z=S[0]+S[1];P=F.Env.evt.handles[Z];if(P){while(P.length){V=P.pop();V.detach();}return(this._yuievt.chain)?this:true;}X=S[1];}else{if(G.isObject(X)&&X.detach){W=X.detach();return(this._yuievt.chain)?this:true;}}U=F.Env.evt.plugins[X];if(this instanceof YUI){if(U&&U.detach){return U.detach.apply(F,arguments);}else{if(!U&&X.indexOf(":")==-1){return F.Event.detach.apply(F.Event,arguments);}}}if(X){R=a[X];if(R){return R.detach(Y,Q);}}else{for(T in a){if(a.hasOwnProperty(T)){W=W&&a[T].detach(Y,Q);}}return W;}return(this._yuievt.chain)?this:false;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(L){L=N(this,L);return this.detach(L);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(Q,R){Q=N(this,Q);var P,S,L,T=R||{};if(G.isObject(Q)){L={};F.each(Q,function(V,U){L[U]=this.publish(U,V||R);},this);return L;}P=this._yuievt.events;S=P[Q];if(S){S.applyConfig(R,true);}else{F.mix(T,this._yuievt.defaults);S=new F.CustomEvent(Q,T);P[Q]=S;if(T.onSubscribeCallback){S.subscribeEvent.on(T.onSubscribeCallback);}}if(typeof T==F.CustomEvent){P[Q].broadcast=false;}return P[Q];},addTarget:function(L){this._yuievt.targets[F.stamp(L)]=L;this._yuievt.hasTargets=true;},removeTarget:function(L){delete this._yuievt.targets[F.stamp(L)];},fire:function(R){var T=G.isString(R),Q=(T)?R:(R&&R.type),S,L,P;Q=N(this,Q);S=this.getEvent(Q);if(!S){if(this._yuievt.hasTargets){S=this.publish(Q);S.details=F.Array(arguments,(T)?1:0,true);return this.bubble(S);}P=true;}else{L=F.Array(arguments,(T)?1:0,true);P=S.fire.apply(S,L);S.target=null;}return(this._yuievt.chain)?this:P;},getEvent:function(L){L=N(this,L);var P=this._yuievt.events;return(P&&L in P)?P[L]:null;},bubble:function(P){var U=this._yuievt.targets,Q=true,S,T,V,L,R;if(!P.stopped&&U){for(R in U){if(U.hasOwnProperty(R)){S=U[R];T=P.type;
V=S.getEvent(T);L=P.target||this;if(!V){V=S.publish(T,P);V.context=(P.host===P.context)?S:P.context;V.host=S;V.defaultFn=null;V.preventedFn=null;V.stoppedFn=null;}V.target=L;V.currentTarget=S;Q=Q&&V.fire.apply(V,P.details);if(V.stopped){break;}}}}return Q;},after:function(Q,P){var L=F.Array(arguments,0,true);switch(G.type(Q)){case"function":return F.Do.after.apply(F.Do,arguments);case"object":L[0]._after=true;break;default:L[0]=K+Q;}return this.on.apply(this,L);},before:function(){return this.on.apply(this,arguments);}};F.EventTarget=O;F.mix(F,O.prototype,false,false,{bubbles:false});O.call(F);YUI.Env.globalEvents=YUI.Env.globalEvents||new O();F.Global=YUI.Env.globalEvents;})();},"@VERSION@",{requires:["oop"]});