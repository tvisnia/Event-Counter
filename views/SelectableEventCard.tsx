import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { CheckBox } from 'react-native-elements'
import Event from '../model/Event'
import EventCard from './EventCard';
import { TouchableOpacity } from 'react-native';

interface Props {
    event: Event;
    onPress: () => void;
    updateSelectedEventsList: (id: string, selected: boolean) => void;
    onLongPress: () => void;
    selectionMode: boolean;
};

const SelectableEventCard = (props: Props) => {

    const [selected, setSelected] = useState(false)
    const { event, selectionMode, onLongPress, onPress, updateSelectedEventsList } = props

    function onSelectablePress(id: string, selected: boolean) {
        setSelected(selected);
        updateSelectedEventsList(id, selected);
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={selectionMode === true ? () => onSelectablePress(event.id, !selected) : () => onPress()}
            onLongPress={() => onLongPress()}
        >
            <View pointerEvents="none" style={styles.cardWrapper}>
                <EventCard event={event} />
                {selectionMode &&
                    <View style={styles.checkBox}>
                        <CheckBox
                            checked={selected}>
                        </CheckBox>
                    </View>
                }
            </View>
        </TouchableOpacity >
    )
}

export default SelectableEventCard

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginBottom: 15,
    },
    checkBox: {
        backgroundColor: '#ffffff'
    },
    cardWrapper: {
        flexDirection: "row",
        backgroundColor: '#ffffff',
        elevation: 3
    }
})