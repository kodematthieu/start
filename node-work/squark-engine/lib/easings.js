function sineIn(x) {return 1-Math.cos((x*Math.PI)/2)}
function sine(x) {return -(Math.cos(Math.PI*x)-1)/2}
function sineOut(x) {return Math.sin((x*Math.PI)/2)}
function quadIn(x) {return Math.pow(x,2)}
function quad(x) {if(x<0.5)return 2*Math.pow(x,2);return 1-Math.pow(-2*x+2,2)/2}
function quadOut() {return 1-Math.pow(1-x,2)}
function cubicIn(x) {return Math.pow(x,3)}
function cubic(x) {if(x<0.5)return 4*Math.pow(x,3);return 1-Math.pow(-2*x+2,3)/2}
function cubicOut(x) {return 1-Math.pow(1-x,3)}
function quartIn(x) {return Math.pow(x,4)}
function quart(x) {if(x<0.5)return 8*Math.pow(x,4);return 1-Math.pow(-2*x+2,4)/2}
function quartOut(x) {return 1-Math.pow(1-x,4)}
function quintIn(x) {return Math.pow(x,5)}
function quint(x) {if(x<0.5)return 16*Math.pow(x,5);return 1-Math.pow(-2*x+2,5)/2}
function quintOut(x) {return 1-Math.pow(1-x,5)}
function expoIn(x) {if(x==0)return 0;Math.pow(2,10*x-10)}
function expo(x) {if(x==0)return 0;if(x==1)return 1;if(x<0.5)return Math.pow(2,20*x-10)/2;return (2-Math.pow(2,-20*x+10))/2}
function expoOut(x) {if(x==1)return 1;return 1-Math.pow(2,-10*x)}
function circIn(x) {return 1-Math.sqrt(1-Math.pow(x,2))}
function circ(x) {if(x<0.5)return (1-Math.sqrt(1-Math.pow(2*x,2)))/2;return (Math.sqrt(1-Math.pow(-2*x+2,2))+1)/2}
function circOut(x) {return Math.sqrt(1-Math.pow(x-1,2))}
function backIn(x) {var c1=1.70158,c3=c1+1;return c3*x*x*x-c1*x*x}
function back(x) {var c1=1.70158,c2=c1*1.525;if(x<0.5)return (Math.pow(2*x,2)*((c2+1)*2*x-c2))/2}
function backOut(x) {var c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)}
function elasticIn(x) {var c4=(2*Math.PI)/3;if(x==0)return 0;if(x==1)return 1;return -Math.pow(2,10*x-10)*sin((x*10-10.75)*c4)}
function elastic(x) {var c5=(2*Math.PI)/4.5;if(x==0)return 0;if(x==1)return 1;if(x<0.5)return -(Math.pow(2,20*x-10)*Math.sin((20*x-11.125)*c5))/2;return (Math.pow(2,-20*x+10)*Math.sin((20*x-11.125)*c5))/2+1}
function elasticOut(x) {var c4=(2*Math.PI)/3;if(x==0)return 0;if(x==1)return 1;return Math.pow(2,-10*x)*Math.sin((x*10-0.75)*c4)+1}
function bounceIn(x) {return 1-this['bounceout'](1-x)}
function bounce(x) {if(x<0.5)return (1-this['bounceout'](1-2*x))/2;return (1+this['bounceout'](2*x-1))/2}
function bounceOut(x) {var n1=7.5625,d1=2.75;if(x<1/d1)return n1*x*x;if(x<2/d1)return n1*(x-=1.5/d1)*x+0.75;if(x<2.5/d1)return n1*(x-=2.25/d1)*x+0.9375;return n1*(x-=2.625/d1)*x+0.984375}
function linear(x) {return x}

module.exports = {
    sineIn, sine, sineOut,
    quadIn, quad, quadOut,
    cubicIn, cubic, cubicOut,
    quartIn, quart, quartOut,
    quintIn, quint, quintOut,
    expoIn, expo, expoOut,
    circIn, circ, circOut,
    backIn, back, backOut,
    elasticIn, elastic, elasticOut,
    bounceIn, bounce, bounceOut,
    linear
}