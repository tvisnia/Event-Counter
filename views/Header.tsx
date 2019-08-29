import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import DeleteIcon from "./DeleteIcon";

interface HeaderProps {
    defaultTitle: string;
    selectionMode: boolean;
    selected?: number;
    onDeletePress: () => void;
}

const Header = (props: HeaderProps) => {
    const { selectionMode, selected, onDeletePress, defaultTitle } = props;
    const [title] = useState(defaultTitle)
    const isInSelectionMode = () => { return selectionMode === true };


    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{isInSelectionMode() ? `Events to delete : ${selected}` : title}</Text>
            {isInSelectionMode() &&
                <TouchableOpacity onPress={onDeletePress}>
                    <DeleteIcon />
                </TouchableOpacity>}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingRight: 15,
        height: 65,
        paddingHorizontal: 15,
        elevation: 8,
    },
    headerText: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "bold"
    }
})
