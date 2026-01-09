import Home from "./Home"
import Login from "./Login"
import NotFound from "./NotFound"
import Signup from "./Signup"

const page_routes = [
  { path: '/', page: Home, protected: true },
  { path: '/login', page: Login, protected: false },
  { path: '/signup', page: Signup, protected: false },
  { path: '*', page: NotFound },  
];

export default page_routes;

