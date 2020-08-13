import { createStackNavigator } from "react-navigation";
import SearchScreen from './components/search/SearchScreen';
import ResultsScreen from './components/results/ResultsScreen';
import VideoPlayback from './components/video/VideoPlayback';

const StackNav = createStackNavigator ({
    SearchScreen:
    {
        screen: SearchScreen
    },
    ResultsScreen:
    {
        screen: ResultsScreen
    },
    VideoPlayback:
    {
        screen: VideoPlayback
    },
},
{
    headerMode: 'none'
});

export default StackNav;