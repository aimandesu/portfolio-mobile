import {createDrawerNavigator} from '@react-navigation/drawer';
import Profile from '../../screens/Profile/Profile';

//type use
type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        headerShown: false,
      }}
      // drawerContent={(props) => {
      //   const routeName = props.state.routeNames[props.state.index];
      //   return routeName === 'Profile'
      //     ? <ProfileDrawerContent {...props} />
      //     : <HomeDrawerContent {...props} />;
      // }}
    >
      {/* <Drawer.Screen name="Home" component={Home} /> */}
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};
