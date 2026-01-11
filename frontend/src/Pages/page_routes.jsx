import Home from "./Home"
import Login from "./Login"
import NotFound from "./NotFound"
import Signup from "./Signup"
import Quiz from "./Quiz"
import Stats from "./Stats"
import StatsShare from "./StatsShare"

const page_routes = [
    { path: '/', page: Home, protected: true },
    { path: '/login', page: Login, protected: false },
    { path: '/signup', page: Signup, protected: false },
    { path: '/quiz/:category', page: Quiz, protected: true},
    { path: '/stats/:category', page: Stats, protected: true},
    { path: '/stats/share/:share_id', page: StatsShare, protected: false},
    { path: '*', page: NotFound },  
];

export default page_routes;

