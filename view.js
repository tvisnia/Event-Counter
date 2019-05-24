<View style={styles.cardHeader}>
<Text style={styles.date}>{formatDate(event.date)}</Text>
<Text style={styles.title}>{event.title}</Text>
</View>

<View style={styles.counterContainer}>
<View
    style={styles.counter}>
    <Text style={styles.counterText}>{days}</Text>
    <Text style={styles.counterLabel}>DAYS</Text>
</View>
<View
    style={styles.counter}>
    <Text style={styles.counterText}>{hours}</Text>
    <Text style={styles.counterLabel}>HOURS</Text>
</View>
<View
    style={styles.counter}>
    <Text style={styles.counterText}>{minutes}</Text>
    <Text style={styles.counterLabel}>MINUTES</Text>
</View>
<View
    style={styles.counter}>
    <Text style={styles.counterText}>{seconds}</Text>
    <Text style={styles.counterLabel}>SECONDS</Text>
</View>
</View>