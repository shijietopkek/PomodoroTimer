import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Picker, TouchableOpacity } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Icon from 'react-native-vector-icons/FontAwesome'
import { styles } from './stylesheet';
import Buttons from './components/button';
import Timer from './components/timer';
import vibrate from './utils/vibrate';
import Slider from '@react-native-community/slider';
import { RNNotificationBanner } from 'react-native-notification-banner';
import ModalSelector from 'react-native-modal-selector'

import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {
    Player,
    Recorder,
    MediaStates
} from '@react-native-community/audio-toolkit';






const DATA = {
  minTimer:1,
  maxTimer:60,
  minBreak:1,
  maxBreak:15,
}

function leftPadding(n) {
  if (parseInt(n) < 10) {
    return "0" + n.toString();
  } else {
    return n.toString();
  }
}

function getTime(val) {
  return leftPadding(val) + ":00";
}

function ButtonsRow({ children }) {
  return (
    <View style={styles.buttonsRow}>{children}</View>
  )
}
function ButtonsRow1({ children }) {
  return (
    <View style={styles.buttonsRow1}>{children}</View>
  )
}


class App extends React.Component {


  
  constructor(props) {
    super(props),
    this.state = {
      currentTime: "25:00",
      workTime: "25:00",
      breakTime: "05:00",
      working: true,
      timer: null,
      paused: false,
      playing: false,
      ticking:true,
      musicfile:"",


    }
    this.p= new Player(this.state.musicfile,{autoDestroy:false,continuesToPlayInBackground:true,mixWithOthers:true})
    



    this.setWorkTimer = this.setWorkTimer.bind(this);
    this.setBreakTimer = this.setBreakTimer.bind(this);
    this.playButton = this.playButton.bind(this);
    this.pauseButton = this.pauseButton.bind(this);
    this.resetButton = this.resetButton.bind(this);
    this.countdown = this.countdown.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.toggleStatus1 = this.toggleStatus1.bind(this);
    this.toggleStatus2 = this.toggleStatus2.bind(this);
    this.toggleTicking = this.toggleTicking.bind(this);
  }

  

  setWorkTimer(val) {
    let newTime = getTime(val);
    this.setState({
      workTime: newTime,
    });
    if (!this.state.timer && this.state.working) {
      this.setState({
        currentTime: newTime,
      });
    }      
  }

  setBreakTimer(val) {
    let newTime = getTime(val);
    this.setState({
      breakTime: newTime,
    });
    if (!this.state.timer && !this.state.working) {
      this.setState({
        currentTime: newTime,
      });
    }   
  }

  notifBanner(title, subTitle, withIcon, duration){
      return(
          RNNotificationBanner.Show({ title: title, subTitle: subTitle, withIcon: withIcon, duration:duration})
      )
  }

  playButton() {
    if(this.state.paused==false && this.state.playing==false){
      this.p= new Player(this.state.musicfile,{autoDestroy:false,continuesToPlayInBackground:true,mixWithOthers:true})
      
    this.p.play()
    //
    }
    else{
      this.p.play()
      //
    }
    

    if(this.state.working){
      this.notifBanner("Playing", "Time to Focus!", false, 2000)
      //RNNotificationBanner.Show({ title: "Playing", subTitle: "Time to Focus!", withIcon: false, duration:2000})
    }else{
      this.notifBanner("Playing", "Enjoy your break!", false, 2000)
      //RNNotificationBanner.Show({title:"Playing",subTitle:"Enjoy your break!", withIcon: false, duration:2000})
    }

    if (this.state.paused === true || this.state.playing === false) { 
      
      
      this.setState({
        timer: BackgroundTimer.setInterval(() => { 
this.countdown()
}, 
1000),
        paused: false,
        playing: true,
      });
    }

  }

  pauseButton () {
    this.p.pause()
    this.notifBanner("Paused",`Don't stop! ${this.state.currentTime} more to go`,false,2000)
    //RNNotificationBanner.Show({title:"Paused",subTitle:`Don't stop! ${this.state.currentTime} more to go`, withIcon: false, duration:2000})
    if (this.state.paused === false && this.state.playing === true) {
      BackgroundTimer.clearInterval(this.state.timer);
      this.setState({
        paused: true,
        timer: null,
        playing: false,
      });
      console.log(this.state.paused);
    } else if (this.state.paused === true && this.state.playing === false) {
      this.playButton();
    }       
  }

  resetButton () {
    this.p.destroy()
    this.p= new Player(this.state.musicfile,{autoDestroy:false,continuesToPlayInBackground:true,mixWithOthers:true})
    
    if(this.state.timer){
      BackgroundTimer.clearInterval(this.state.timer);
    }
    if(this.state.working===true){
      this.notifBanner("Reset",`Timer reset to ${this.state.workTime}`,false,2000)
      //RNNotificationBanner.Show({title:"Reset",subTitle:`Timer reset to ${this.state.workTime}`, withIcon: false, duration:2000})
      this.setState({
      currentTime: this.state.workTime,
      playing: false,
      paused: false,
      working: true,
      timer: null
    })
  }else{
    this.notifBanner("Reset",`Timer reset to ${this.state.breakTime}`,false,2000 )
    //RNNotificationBanner.Show({title:"Reset",subTitle:`Timer reset to ${this.state.breakTime}`, withIcon: false, duration:2000})

    this.setState({
      currentTime: this.state.breakTime,
      playing: false,
      paused: false,
      working: false,
      timer: null
    })
  }
    
  }

  toggleTicking(){
    this.setState({
      ticking: !this.state.ticking
    })
  }

  countdown() {
    if (this.state.currentTime === "00:00" && this.state.playing === true) {
      if(this.state.working){
        this.notifBanner("End of Work","Congratulations! You deserve a break.",false,2000 )
        RNNotificationBanner.Show({title:"End of Work",subTitle:"Congratulations! You deserve a break.", withIcon: false, duration:2000})
      }else{
        this.notifBanner("End of Break","Let's resume work.",false,2000 )
        //RNNotificationBanner.Show({title:"End of Break",subTitle:"Let's resume work.", withIcon: false, duration:2000})
      }

      vibrate();
      if(this.p){
        this.p.destroy()
        this.p= new Player(this.state.musicfile,{autoDestroy:false,continuesToPlayInBackground:true,mixWithOthers:true})
      
      }
      new Player('alarm.mp3',{continuesToPlayInBackground:true}).play()
      this.toggleStatus();
      
      

    } else {
      if(this.state.ticking){
        new Player('ticking1.mp3',{continuesToPlayInBackground:true, mixWithOthers:true}).play()
      }
      let sec = this.state.currentTime.slice(3);
      let min = this.state.currentTime.slice(0, 2);
      if (sec === "00") {
        let newMin = leftPadding(parseInt(min) - 1);
        let newTime = newMin + ":59";
        this.setState({
          currentTime: newTime,
        });
      } else {
        let newSec = leftPadding((parseInt(sec) - 1));
        let newTime = min + ":" + newSec;
        this.setState({
          currentTime: newTime,
        })
      }
    }
  }

  toggleStatus() {
    BackgroundTimer.clearInterval(this.state.timer);
    if (this.state.working) {
      this.setState({
        working: false,
        currentTime: this.state.breakTime,
        playing:false,
        paused:false,
        timer:null
      })
    } else {
      this.setState({
        working: true,
        currentTime: this.state.workTime,
        playing:false,
        paused:false,
        timer:null
      })
    }
  }

  toggleStatus1() {
    if(this.state.timer){
      BackgroundTimer.clearInterval(this.state.timer);
    }
    this.p.destroy()
    this.p= new Player(this.state.musicfile,{autoDestroy:false,continuesToPlayInBackground:true,mixWithOthers:true})
      
    this.setState({
      working: false,
      currentTime: this.state.breakTime,
      playing:false,
      paused:false,
      timer:null
    })
  }

  toggleStatus2() {
    if(this.state.timer){
      BackgroundTimer.clearInterval(this.state.timer);
    }
    this.p.destroy()
    this.p= new Player(this.state.musicfile,{autoDestroy:false,continuesToPlayInBackground:true,mixWithOthers:true})
      
    this.setState({
      working: true,
      currentTime: this.state.workTime,
      playing:false,
      paused:false,
      timer:null
    })
  }





  render() {
    let index = 0;
    const modalTextStyle={
      color: 'white',
      fontSize: 24
    }
    const data = [
            { key: index++, section: true, label: 'Select Background Music' },
            { key: index++, label: '',component: <Text style={modalTextStyle}>None</Text> },
            { key: index++, label: 'white_noise.mp3',component: <Text style={modalTextStyle}>White Noise</Text> },
            { key: index++, label: 'forest.mp3' ,component: <Text style={modalTextStyle}>Forest</Text>},
            { key: index++, label: 'ocean.mp3',component: <Text style={modalTextStyle}>Ocean</Text>},
            { key: index++, label: 'rain.mp3',component: <Text style={modalTextStyle}>Rain</Text>},
            { key: index++, label: 'classical.mp3',component: <Text style={modalTextStyle}>Classical</Text>},
            { key: index++, label: 'ragtime.mp3',component: <Text style={modalTextStyle}>Ragtime</Text>}
        ];
    return (
      <View style={styles.container}>
        <View style={styles.timerUi}>
         <ButtonsRow1>
            {this.state.ticking && (
              <Buttons 
            icon="clock-o"
            color='#FFFFFF'
            background='#3D3D3D'
            onPress={()=>{this.toggleTicking();this.notifBanner("Ticking Timer", "Disabled",false,2000)}} 
  
                     />
              ) }
            {!this.state.ticking && (
              <Buttons 
            icon="clock-o"
            color='#777777'
            background='#333333'
            onPress={()=>{this.toggleTicking();this.notifBanner("Ticking Timer", "Enabled",false,2000)}} 
  
                     />
              )}
            <ModalSelector
            selectedItemTextStyle={{color:'#696969'}}
                    sectionTextStyle={{color:'#444444',fontSize:20}}
                    cancelTextStyle={{color:'#444444',fontSize:20}}
                    data={data}
                    initValue="Select background music!"
                    supportedOrientations={['landscape']}
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    onChange={(option)=>{this.setState({musicfile:option.label}); this.notifBanner("Background Music", `${option.label}`,false,2000)}}>
 
                    <Buttons 
            icon="music"
            color='#FFFFFF'
            background='#00aced'  
                     />
 
                </ModalSelector>
              
            
          </ButtonsRow1>
                <Timer currentTime={this.state.currentTime}/>
          <View>
      <Text style={styles.label}>{this.state.working ? "work time" : "break time"}</Text>
      </View>

          
          {this.state.playing===true && (
            <ButtonsRow>
            <Buttons 
            title="Reset" 
            color='#FFFFFF'
            background='#3D3D3D'
            onPress={this.resetButton} 
  
                     />
            <Buttons 
              title="Pause" 
              color='#E33935'
              background='#3C1715'
              onPress={this.pauseButton} 
           
            />
            </ButtonsRow>

            )}
          {this.state.paused===false && this.state.playing===false && (
            <ButtonsRow>
            <Buttons 
            title="Reset" 
            color='#FFFFFF'
            background='#3D3D3D'
            disabled 
  
                     />

            <TouchableOpacity
          onPress={this.state.working ? this.toggleStatus1 : this.toggleStatus2}
          style={[ styles.buttonOval, { backgroundColor: '#444444'}]}
          activeOpacity={this.props.disabled ? 1.0 : 0.7}
        >
          <View style={styles.buttonOvalBorder}>
            <Text style={[ styles.buttonOvalTitle, { color:'#cccccc'}]}>{this.state.working ? "Skip to Break" : "Skip to Work"}</Text>
          </View>
        </TouchableOpacity>

            <Buttons 
            title="Play" 
            color='#50D167'
            background='#1B361F'
            onPress={this.playButton} 
          
          />
          </ButtonsRow>

            )}
          {this.state.paused===true && this.state.playing===false && (
            <ButtonsRow>
            <Buttons 
            title="Reset" 
            color='#FFFFFF'
            background='#3D3D3D'
            onPress={this.resetButton} 
  
                     />

            <TouchableOpacity
          onPress={this.state.working ? this.toggleStatus1 : this.toggleStatus2}
          style={[ styles.buttonOval, { backgroundColor: '#444444'}]}
          activeOpacity={this.props.disabled ? 1.0 : 0.7}
        >
          <View style={styles.buttonOvalBorder}>
            <Text style={[ styles.buttonOvalTitle, { color:'#cccccc'}]}>{this.state.working ? "Skip to Break" : "Skip to Work"}</Text>
          </View>
        </TouchableOpacity>

            <Buttons 
            title="Play" 
            color='#50D167'
            background='#1B361F'
            onPress={this.playButton} 
          
          />
          </ButtonsRow>

            )}
    
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.colorWhite}>Set Work Duration</Text>
          
          <Slider
    
            style={{width: vw(80)}}
            minimumValue={DATA.minTimer}
            maximumValue={DATA.maxTimer}
            step={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={25}
            onValueChange={value => this.setWorkTimer(value.toString())}
          />

          <View style={styles.textCon}>
                    <Text style={styles.colorGrey}>{DATA.minTimer}</Text>
                    <Text style={styles.colorYellow}>
                        {this.state.workTime==="25:00" ? this.state.workTime.slice(0,2).replace(/^0+/, '')+" (recommended)":this.state.workTime.slice(0,2).replace(/^0+/, '')}
                    </Text>
                    <Text style={styles.colorGrey}>{DATA.maxTimer}</Text>
                </View>

      </View> 
        <View style={styles.menuContainer}>
          <Text style={styles.colorWhite}>Set Break Duration</Text>
          
          <Slider
    
            style={{width: vw(80)}}
            minimumValue={DATA.minBreak}
            maximumValue={DATA.maxBreak}
            step={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={5}
            onValueChange={value => this.setBreakTimer(value.toString())}
          />

          <View style={styles.textCon}>
                    <Text style={styles.colorGrey}>{DATA.minBreak}</Text>
                    <Text style={styles.colorYellow}>
                        {this.state.breakTime==="05:00" ? this.state.breakTime.slice(0,2).replace(/^0+/, '')+ " (recommended)":this.state.breakTime.slice(0,2).replace(/^0+/, '')}
                    </Text>
                    <Text style={styles.colorGrey}>{DATA.maxBreak}</Text>
                </View>
        </View>

      </View>
    );
  }
}

export default App;