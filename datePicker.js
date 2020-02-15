import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome5 } from '@expo/vector-icons';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: dateify(props.date), active: false };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { date: dateify(nextProps.date) };
  }

  render() {
    const { minDate, maxDate, style, onChange } = this.props;
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.touchableContainer} onPress={() => this.setState({ active: true })}>
          <FontAwesome5 style={styles.dateIcon} name='calendar-day' />
          <Text style={styles.dateText}>{formatDate(this.state.date)}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={this.state.active}
          date={this.state.date}
          onConfirm={(date) => { this.setState({ active: false, date }); onChange(date); }}
          onCancel={() => this.setState({ active: false })}
          mode='time'
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      </View>
    );
  }
}

function dateify(date) {
  if (date instanceof Date) {
    return date;
  } else if (typeof(date) === 'string') {
    if (date.includes('-')) {
      const split = date.split('-');
      return new Date(split[0], split[1], split[2]);
    } else {
      return new Date(date);
    }
  }
}

function formatDate(date) {
  if (!date) return '';
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  datePicker: {
    // flex: 1,
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    height: 40,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#514E5A',
    color: '#333',
    marginTop: 10,
  },
  dateIcon: {
    color: '#333',
    fontSize: 20,
    alignSelf: 'center'
  },
  dateText: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
})
 