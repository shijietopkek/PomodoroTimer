import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../stylesheet';

export default class Timer extends React.Component {
	render() {
		return (
      <View style={styles.timerContainer}>
			<Text style={styles.timer}>{this.props.currentTime}</Text>
      </View>
		)
	}
}