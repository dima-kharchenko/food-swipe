import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { login } from "../api";

const USER_REGEX = /^(?=.{3,}$)/;
const PWD_REGEX = /^(?=.{3,}$)/;

function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({value: "", isValid: false});
    const [pwd, setPwd] = useState({value: "", isValid: false});
    const [error, setError] = useState('')

    useEffect(() => {
        setUser(p => ({...p , isValid: USER_REGEX.test(user.value)}));
    }, [user.value])

    useEffect(() => {
        setPwd(p => ({...p, isValid: PWD_REGEX.test(pwd.value)}))
    }, [pwd.value])

    useEffect(() => {
        setError('');
    }, [user.value, pwd.value])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(user.isValid && pwd.isValid)) {
            setError("Invalid Entry");
            return;
        }
        try {
            await login(user.value, pwd.value);
            navigate('/')
        }
        catch(err) {
            if (!err?.response) {
                setError('No Server Response');
            } else {
                setError('Login Failed')
            }
        }
    }

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-sm bg-surface-a10 p-6 rounded-2xl border-2 border-primary-a0">
        <p className="text-2xl font-semibold text-center text-primary-a0 mb-6">
          Log In 
        </p>
        <form className="space-y-4 text-white" onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              className={`w-full px-4 py-2 rounded-lg bg-surface-a20 placeholder-surface-a50 focus:outline-none focus:ring-primary-a0 transition ${user.isValid || !user.value ? "focus:ring-2" : "ring-2 ring-red-500 focus:ring-red-500"}`}
              placeholder="Username"
              name="username"
              value={user.value}
              onChange={(e) => setUser(p => ({...p, value: e.target.value}))}
            />
            <input
              type="password"
              id="password"
      className={`w-full px-4 py-2 rounded-lg bg-surface-a20 placeholder-surface-a50 focus:outline-none focus:ring-primary-a0 transition ${pwd.isValid || !pwd.value ? "focus:ring-2" : "ring-2 ring-red-500 focus:ring-red-500"}`}
              placeholder="Password"
              value={pwd.value}
              onChange={(e) => setPwd(p => ({...p, value: e.target.value}))}
            />
            <button
              type="submit"
              className="w-full py-2 mt-4 rounded-lg bg-primary-a0 hover:bg-primary-a30 transition cursor-pointer">
              Log In 
            </button>
            <a className="text-primary-a0 hover:text-primary-a30 transition text-sm" href="/signup">Don't have an account?</a>
        </form>
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>  
    );
}

export default Login;
