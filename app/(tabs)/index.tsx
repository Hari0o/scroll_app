import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Easing, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../../store/noteStore';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 40, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  tab: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
  tabActive: { backgroundColor: '#4f8cff' },
  tabText: { fontWeight: 'bold', color: '#222', fontFamily: 'ndot57' },
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#4f8cff', fontFamily: 'ndot57' },
  subtitle: { fontSize: 16, color: '#555', fontFamily: 'ndot57' },
  taskList: { marginTop: 24, width: '100%' },
  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, elevation: 1 },
  taskText: { fontSize: 16, flex: 1, fontFamily: 'ndot57' },
  taskDone: { textDecorationLine: 'line-through', color: '#aaa' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 20, fontFamily: 'ndot57' },
});


function HomeScreen() {
  const tasks = useNoteStore((state) => state.tasks);
  const router = useRouter();
  const [fontsLoaded] = useFonts({ ndot57: require('../../assets/fonts/ndot57.ttf') });
  if (!fontsLoaded) return null;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]} onPress={() => {}}>
          <Text style={styles.tabText}>HOME</Text>
        </TouchableOpacity>
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            styles.tabActive,
            pressed ? { backgroundColor: '#e0eaff', transform: [{ scale: 0.97 }] } : null,
          ]}
          onPress={() => router.push('/addnote')}
        >
          <Text style={styles.tabText}>ADD SCROLL</Text>
        </Pressable>
      </View>
      <View style={styles.centeredContent}>
        <Text style={styles.title}>Welcome to Scroll Note!</Text>
        <Text style={styles.subtitle}>Tap ADD SCROLL to create or edit your tasks.</Text>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ScrollingTaskText item={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one!</Text>}
          style={styles.taskList}
        />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

// Marquee/scrolling text for each task
type Task = { id: string; text: string; done: boolean };
function ScrollingTaskText({ item }: { item: Task }) {
  const windowWidth = Dimensions.get('window').width;
  const text = (item.done ? '✓ ' : '') + item.text + '   ';
  const [textWidth, setTextWidth] = React.useState(windowWidth);
  const visibleWidth = windowWidth - 10;
  const anim = React.useRef(new Animated.Value(-textWidth)).current;
  const hasSetWidth = React.useRef(false);

  React.useEffect(() => {
    anim.setValue(-textWidth);
    Animated.loop(
      Animated.timing(anim, {
        toValue: visibleWidth,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [anim, textWidth, item.text, visibleWidth]);

  return (
    <View style={styles.taskRow}>
      <View style={{ overflow: 'hidden', width: visibleWidth, flexDirection: 'row' }}>
        <Animated.View
          style={{
            flexDirection: 'row',
            transform: [{ translateX: anim }],
          }}
        >
          <Text
            style={[styles.taskText, item.done && styles.taskDone]}
            onLayout={e => {
              if (!hasSetWidth.current) {
                setTextWidth(e.nativeEvent.layout.width);
                hasSetWidth.current = true;
              }
            }}
          >
            {text}
          </Text>
          <Text
            style={[styles.taskText, item.done && styles.taskDone]}
          >
            {text}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}


