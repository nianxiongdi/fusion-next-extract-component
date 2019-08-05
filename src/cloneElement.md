React.cloneElement(
  element,
  [props],
  [...children]
)


## 1. element

必须是一个存在的React组件或者原生DOM，以下都可以
```js
    React.cloneElement(<div />)
    React.cloneElement(<Child />)
```

```js
  
class Parent extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 1
    };
  }
  getChildren() {
    const _this = this;
    let { children } = _this.props;
    return React.Children.map(children, child => {
    // console.log( child );
      return React.cloneElement(child, {
        count: this.state.count
      }, <span>children</span>);
    });
  }
  handleClick() {
    this.setState({
      count: this.state.count +1
    });
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick.bind(this)}>点击增加次数</button>
        {this.getChildren()}
      </div>
    );
  }
}

class Child extends React.Component {

  componentWillReceiveProps(nextprops) {
    console.log(nextprops);
  }
 
  render() {
      console.log( this.props.children );
    // return <div>这是子组件：{this.props.count} </div>;
    return <div >这是子组件：{this.props.count}  {this.props.children} </div>;
  }
}

class Test extends React.Component {
  render() {
    return (
      <Parent>
        <Child />
      </Parent>
    );
  }
}
```