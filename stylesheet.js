import { StyleSheet } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';


export const styles = StyleSheet.create({
  container: {
  	flex:1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    paddingHorizontal:0
    
  
  },
  timerContainer: {
    position: 'relative',
    marginTop:20

  },
  timer: {
    color:'#fff',
    fontSize: 100,
    fontWeight:'100',
  },
  timerUi: {
  	flex:4,
  	alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    color:'#fff',
    fontSize: 30,
    marginTop: 10,
    alignSelf: 'center'
  },
  labelContainer: {
    height: 60,        
    justifyContent: 'center',
  },

  dropdownTextStyle: {
    fontSize: 20
  },
  textStyle: {
    fontSize: 20,
  },
  dropdownButtonStyle: {
    width: 30,
    backgroundColor: "#dddddd",
    borderRadius: 5,
    alignItems: 'center'
  },

  menuContainer: {
  	width:vw(100),
  	flex:1,

    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#222222'
  },
  textCon: {
  	width:vw(90),
  	flexDirection:'row',
  	justifyContent:'space-between',
  	marginBottom:0
  },
  colorGrey: {
        color: '#d3d3d3'
	},
	colorYellow: {
	    color: 'rgb(252, 228, 149)'
	},
	colorWhite: {
		color:'#fff'
	},
	buttonsRow:{
	flexDirection: 'row',
	alignSelf: 'stretch',
    justifyContent: 'space-between',
    width:vw(90),
    marginTop:60
    
},
buttonsRow1:{
  flexDirection: 'row',
  alignSelf: 'stretch',
    justifyContent: 'space-between',
    width:vw(90),
    marginTop:0
    
},
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOval:{
    position:'relative',
    width:120,
    height:60,
    borderRadius:40,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',

  },
  buttonOvalBorder:{
    width:116,
    height:56,
    borderRadius:28,
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center'

  },
  buttonOvalTitle:{
    fontSize: 16
  }

});