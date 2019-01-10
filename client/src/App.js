import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { withRouter } from 'react-router-dom'

const HomePage = () => (
  <AuthContext>
    {({ signOut }) => (
      <div>
        <h1>Welcome !</h1>
        <button onClick={signOut}>LOGOUT</button>
      </div>
    )}
  </AuthContext>
);
const Button = withRouter(({ history }) => (
  <button type="button"
   onClick={() => { history.push('/signin') }}>SIGNIN</button>
));

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthContext>
      {({ error, user, signIn }) => {

        if (user) {
          return <Redirect to="/" />;
        }

        const onSubmit = (e) => {
          e.preventDefault();
          signIn({ username, password });
        };

        return (
          <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <br />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <br />
              <button type="submit">LOGIN</button>
              <p style={{ color: 'red' }}>{error}</p>
              <button type="Button">SIGNIN</button>
              <p style={{ color: 'red' }}>{error}</p>
            </form>
          </div>
        )
      }}
    </AuthContext>
  )
}

const SigninPage = () => {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthContext>
      {({ error, user, signIn }) => {

        if (user) {
          return <Redirect to="/" />;
        }

        const onSubmit = (e) => {
          e.preventDefault();
          signIn({ username, password });
        };

        return (
          <div>
            <h1>Sing In</h1>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="lastname"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
              />
              <input
                type="text"
                placeholder="firstname"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
              />
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <br />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <br />
              <button type="submit">SIGNIN</button>
              <p style={{ color: 'red' }}>{error}</p>
            </form>
          </div>
        )
      }}
    </AuthContext>
  )
}

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(params) => (
    <AuthContext>
      {({ user }) => user
        ? <Component {...params} />
        : <Redirect to="/login" />}
    </AuthContext>
  )}
  />
)

export default () => (
  <Switch>
    <ProtectedRoute path="/" exact component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/signin" component={SigninPage} />
  </Switch>
);
