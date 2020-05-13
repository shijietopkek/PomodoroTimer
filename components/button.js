import React from 'react';
import { View, Button, TouchableOpacity,Text} from 'react-native';
import { styles } from '../stylesheet';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Buttons extends React.Component {
	constructor(props){
		super(props)
		this.state={}
	}




  render() {
    return (
      <TouchableOpacity
      onPress={() => !this.props.disabled && this.props.onPress()}
      style={[ styles.button, { backgroundColor: this.props.background}]}
      activeOpacity={this.props.disabled ? 1.0 : 0.7}
    >
      <View style={styles.buttonBorder}>
      {this.props.title && (
          <Text style={[ styles.buttonTitle, { color:this.props.color }]}>{this.props.title}</Text>
        )}
      {this.props.icon && (
          <Icon name={this.props.icon} size={40} color={this.props.color} />
        )}

      </View>
    </TouchableOpacity>
    )
  }
}

