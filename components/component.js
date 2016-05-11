var React=require('react');
var ReactDOM=require('react-dom');

function getRandomBetween(a,b){
  return Math.ceil(Math.random()*(b-a)+a);
}
function getRandomAngle(){
  return Math.random()>0.5?Math.ceil(Math.random()*30)+'deg':'-'+Math.ceil(Math.random()*30)+'deg';
}

var ImageModule=React.createClass({
  render: function(){
    var styleObj={};
    var t=this;
    styleObj.left=this.props.arrange.pos.left;
    styleObj.top=this.props.arrange.pos.top;
    ['WebkitTransform','MozTransform','msTransform','transform'].forEach(function(value){
      styleObj[value]='rotate('+t.props.arrange.rotate+')';
    });
    styleObj.zIndex=this.props.arrange.isCenter?1:0;
    return (
      <figure className='img-figure' style={styleObj}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
});

var CtrlModule=React.createClass({
  handleClick: function(e){
    if(!this.props.isCenter){
      this.props.reArrange();
    }
    e.preventDefault();
    e.stopPropagation();
  },

  render: function(){
    var styleObj={};
    styleObj.backgroundColor=this.props.isCenter?'brown':'gray';
    return(
      <span className='ctrl-spot' style={styleObj} onClick={this.handleClick}>
      </span>
    )
  }
});

var GalleryApp=React.createClass({
  Constant: {
    leftMin:0,
    leftMax:0,
    rightMin:0,
    rightMax:0,
    topMin:0,
    topMax:0,
    leftCenter:0,
    topCenter:0,
    stageHeight:0
  },

  getInitialState: function(){
    return {
      imgsArrangeArr:[
        /*
        pos:{
        left,
        top
      }
        rotate:0,
        isInverse: false,
        isCenter: false,
        zIndex: 0
        */
      ],
      stageHeight:window.innerHeight
    };
  },

  reArrange: function(centerIndex){
    var imgsArrangeArr=this.state.imgsArrangeArr;
    for(var i=0;i<11;i++){
      if(i<6){
        imgsArrangeArr[i].pos.left=getRandomBetween(this.Constant.leftMin,this.Constant.leftMax);
      }else{
        imgsArrangeArr[i].pos.left=getRandomBetween(this.Constant.rightMin,this.Constant.rightMax);
      }
      imgsArrangeArr[i].pos.top=getRandomBetween(this.Constant.topMin,this.Constant.topMax);
      imgsArrangeArr[i].rotate=getRandomAngle();
      imgsArrangeArr[i].isCenter=false;
    }
    imgsArrangeArr[centerIndex].pos.left=this.Constant.leftCenter;
    imgsArrangeArr[centerIndex].pos.top=this.Constant.topCenter;
    imgsArrangeArr[centerIndex].rotate='0deg';
    imgsArrangeArr[centerIndex].isCenter=true;
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },

  componentDidMount: function(){
    var stage=this.refs.stage;
    var img=ReactDOM.findDOMNode(this.refs.img0);
    var stageWidth=stage.clientWidth;
    var stageHeight=stage.clientHeight;
    var imgWidth=img.clientWidth;
    var imgHeight=img.clientHeight;
    this.Constant.leftMin=Math.ceil(-imgWidth/2);
    this.Constant.leftMax=Math.ceil(stageWidth/2-imgWidth*1.5);
    this.Constant.rightMin=Math.ceil(stageWidth/2+imgWidth/2);
    this.Constant.rightMax=Math.ceil(stageWidth-imgWidth/2);
    this.Constant.topMin=Math.ceil(-imgHeight/2);
    this.Constant.topMax=Math.ceil(stageHeight-imgHeight/2);
    this.Constant.leftCenter=Math.ceil(stageWidth/2-imgWidth/2);
    this.Constant.topCenter=Math.ceil(stageHeight/2-imgHeight/2);
    this.Constant.stageHeight=stageHeight;
    this.reArrange(0);
  },

  center: function(i){
    return function(){
      this.reArrange(i);
    }.bind(this);
  },

  render: function(){
    var ImageModules=[],
        CtrlModules=[];
    for(var i=0;i<11;i++){
      var data={};
      data.imgUrl='./img/'+i+'.jpg';
      data.title='Hello World'
      if(!this.state.imgsArrangeArr[i]){
        this.state.imgsArrangeArr[i]={
          pos:{
            left:0,
            top:0
          },
          rotate:'0deg',
          isCenter:false,
        }
      }
      // var center=(function(i){
      //   return function(){
      //     this.reArrange(i);
      //   }.bind(this);
      // })(i);
      // console.log(center);
      var styleObj={};
      styleObj['height']=this.state.stageHeight;
      console.log(styleObj.height);
      ImageModules.push(<ImageModule key={i} data={data} ref={"img"+i} arrange={this.state.imgsArrangeArr[i]}/>);
      CtrlModules.push(<CtrlModule key={i} isCenter={this.state.imgsArrangeArr[i].isCenter} reArrange={this.center(i)}/>);
    }
    return (
      <section className='stage' ref='stage' style={styleObj}>
        <section className='img-stage'>
          {ImageModules}
        </section>
        <section className='ctrl-stage'>
          {CtrlModules}
        </section>
      </section>
    )
  }
});
module.exports=GalleryApp;
