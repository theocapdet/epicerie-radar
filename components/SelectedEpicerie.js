/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { openingStatus } from '../redux/modules/epicerie';
const styles = StyleSheet.create({
  selectedEpicerie: {
     margin: 0,
     height: 100,
     paddingTop: 15,
     paddingLeft: 15,
  },
});

export default class SelectedEpicerie extends Component {

  render(): React.Element<any> {
    const { epicerie } = this.props;
    return (
        <View style={styles.selectedEpicerie}>
          <Text style={{ fontWeight: 'bold' }}>
            {epicerie.name}
          </Text>
          <Text>
            {epicerie.address}
          </Text>
          <Text style={{ paddingTop: 10, color: openingStatus(epicerie).color }}>
            {
              openingStatus(epicerie).text
            }
          </Text>
        </View>
      );
    }
}
