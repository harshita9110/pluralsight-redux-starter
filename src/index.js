import React from 'react';
import ReactDOM from 'react-dom';

class Login extends React.Component
{
  constructor(props){
    super(props);

    this.state={
      'isFetching':false,
      'error':false,
      'songs':[]
    }
  }
  search(form)
  {
      this.setState({isFetching:true});
        SC.get('/tracks', {
    q: `${form.songChoice}`
    }).then(function(tracks) {
      console.log(tracks);
      updateSongs();


    });
  }
  updateSongs()
  {
    this.setState({isFetching:false});
  }

  login(form, redirect)
  {
    this.setState({isFetching:true});
    // setTimeout(()=>{
    //   let success=(Math.random()>0.5);
    //   if(success){
    //     this.setState({isFetching:false});
    //     console.log(`Logged in as ${form.email}!`)
    //     redirect();
    //   } else{
    //     this.setState({isFetching:false,error:true});
    //   }
    // },2000);

    // initiate auth popup
SC.connect().then(function() {
  this.setState({isFetching:false});
  return SC.get('/me');
}).then(function(me) {
  alert('Hello, ' + me.username);
});
  }

  loginRedirect()
  {
    console.log('redirect');
  }

  render(){
    return(
      <div id="login-container" className="auth-container">
      <h1>Login</h1>
      <LoginForm onLogin={this.login.bind(this)} onLoginRedirect={this.loginRedirect.bind(this)}
      isFetching={this.state.isFetching} songs={this.state.songs} error={this.state.error} onSearch={this.search.bind(this)} />
      </div>
    );
  }
}

class LoginForm extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      'songChoice':null
    }
  }

  handleInputChange( evt ){
    this.setState({
      [evt.target.name]:evt.target.value
    });
  }

  handleSubmit( evt ){
    evt.preventDefault();
    this.props.onLogin( this.state, this.props.onLoginRedirect);
  }
  handleSearch(evt)
  {
    evt.preventDefault();
    this.props.onSearch(this.state);
  }
  render(){
    let submitProps, loading,errorString,listItems;

    if(this.props.isFetching)
    {
      submitProps={
        disabled:true
      };
    }
    if(this.props.error)
    {
      errorString="Error logging in";
    }
    if(this.props.songs)
    {
       listItems = this.props.songs.map(function(item){
        return(
          <li key={item.id}>{item.title}</li>
        );
      });
    }

    return(
      <form onSubmit={this.handleSubmit.bind(this)} onChange={this.handleInputChange.bind(this)}>
      <div>
        <label htmlFor="songChoice">Song Choice</label>
        <input type="text" name="songChoice" className="form-control" />
      </div>
      <div>
      <ul>
        {listItems}
      </ul>
      </div>
      <button onClick={this.handleSearch.bind(this)}>Search</button>
      <button type="submit" className="btn btn-primary" {...submitProps}>{'Login'}</button>

      </form>
    );
  }
}

ReactDOM.render(
  <Login />,
  document.getElementById('app')
);
