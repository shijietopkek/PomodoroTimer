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
      musicPlaying:true
    }
    this.setWorkTimer = this.setWorkTimer.bind(this);
    this.setBreakTimer = this.setBreakTimer.bind(this);
    this.playButton = this.playButton.bind(this);
    this.pauseButton = this.pauseButton.bind(this);
    this.resetButton = this.resetButton.bind(this);
    this.countdown = this.countdown.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.toggleStatus1 = this.toggleStatus1.bind(this);
    this.toggleStatus2 = this.toggleStatus2.bind(this);
    this.toggleMusicPlaying = this.toggleMusicPlaying.bind(this);
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

  playButton() {
    
    

    if(this.state.working){
      RNNotificationBanner.Show({ title: "Playing", subTitle: "Time to Focus!", withIcon: false, duration:3000})
    }else{
      RNNotificationBanner.Show({title:"Playing",subTitle:"Enjoy your break!", withIcon: false, duration:3000})
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
    RNNotificationBanner.Show({title:"Paused",subTitle:`Don't stop! ${this.state.currentTime} more to go`, withIcon: false, duration:3000})
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

    if(this.state.timer){
      BackgroundTimer.clearInterval(this.state.timer);
    }
    if(this.state.working===true){
      RNNotificationBanner.Show({title:"Reset",subTitle:`Timer reset to ${this.state.workTime}`, withIcon: false, duration:3000})
      this.setState({
      currentTime: this.state.workTime,
      playing: false,
      paused: false,
      working: true,
      timer: null
    })
  }else{
    RNNotificationBanner.Show({title:"Reset",subTitle:`Timer reset to ${this.state.breakTime}`, withIcon: false, duration:3000})

    this.setState({
      currentTime: this.state.breakTime,
      playing: false,
      paused: false,
      working: false,
      timer: null
    })
  }
    
  }

  toggleMusicPlaying(){
    this.setState({
      musicPlaying: !this.state.musicPlaying
    })
  }

  countdown() {
    if (this.state.currentTime === "00:00" && this.state.playing === true) {
      if(this.state.working){
  
        RNNotificationBanner.Show({title:"End of Work",subTitle:"Congratulations! You deserve a break.", withIcon: false, duration:3000})
      }else{
        RNNotificationBanner.Show({title:"End of Break",subTitle:"Let's resume work.", withIcon: false, duration:3000})
      }

      vibrate();
      new Player('alarm.mp3',{continuesToPlayInBackground:true}).play()
      this.toggleStatus();
      
      

    } else {
      if(this.state.musicPlaying){
        new Player('ticking1.mp3',{continuesToPlayInBackground:true}).play()
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
    this.setState({
      working: true,
      currentTime: this.state.workTime,
      playing:false,
      paused:false,
      timer:null
    })
  }




  render() {
    return (
      <View style={styles.container}>
        <View style={styles.timerUi}>
         <ButtonsRow1>
            {this.state.musicPlaying && (
              <Buttons 
            icon="music"
            color='#FFFFFF'
            background='#00aced'
            onPress={this.toggleMusicPlaying} 
  
                     />
              ) }
            {!this.state.musicPlaying && (
              <Buttons 
            icon="music"
            color='#cccccc'
            background='#777777'
            onPress={this.toggleMusicPlaying} 
  
                     />
              )}
            
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
                        {parseInt(this.state.workTime.slice(0,2))}
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
                        {parseInt(this.state.breakTime.slice(0,2))}
                    </Text>
                    <Text style={styles.colorGrey}>{DATA.maxBreak}</Text>
                </View>
        </View>

      </View>
    );
  }
}

export default App;