import Home from "./Home"
import Login from "./Login"
import NotFound from "./NotFound"
import Signup from "./Signup"
import Quiz from "./Quiz"

const page_routes = [
    { path: '/', page: Home, protected: true },
    { path: '/login', page: Login, protected: false },
    { path: '/signup', page: Signup, protected: false },
    { path: '/quiz/:category', page: Quiz, protected: true},
    { path: '*', page: NotFound },  
];

export default page_routes;

