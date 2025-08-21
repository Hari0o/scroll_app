import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Switch, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useNoteStore } from '../store/noteStore';

export default function AddNoteScreen() {
  const [fontsLoaded] = useFonts({ ndot57: require('../assets/fonts/ndot57.ttf') });
  if (!fontsLoaded) return null;
  const note = useNoteStore((state) => state.note);
  const setNote = useNoteStore((state) => state.setNote);
  const isHorizontal = useNoteStore((state) => state.isHorizontal);
  const setIsHorizontal = useNoteStore((state) => state.setIsHorizontal);
  const tasks = useNoteStore((state) => state.tasks);
  const addTask = useNoteStore((state) => state.addTask);
  const removeTask = useNoteStore((state) => state.removeTask);
  const toggleTask = useNoteStore((state) => state.toggleTask);
  const router = useRouter();
  const [taskText, setTaskText] = useState('');

  const handleAddTask = () => {
    if (taskText.trim()) {
      addTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>EDIT SCROLL</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your note here"
        value={note}
        onChangeText={setNote}
        multiline
      />
      <View style={styles.switchContainer}>
        <Text>Vertical</Text>
        <Switch value={isHorizontal} onValueChange={setIsHorizontal} />
        <Text>Horizontal</Text>
      </View>
      <View style={styles.taskInputRow}>
        <TextInput
          style={styles.taskInput}
          placeholder="Add a task..."
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addTaskBtn} onPress={handleAddTask}>
          <Text style={styles.addTaskBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleTask(item.id)} style={[styles.checkbox, item.done && styles.checkboxDone]}>
              {item.done && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={[styles.taskText, item.done && styles.taskDone]}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one!</Text>}
        style={styles.taskList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faff', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4f8cff', fontFamily: 'ndot57' },
  saveBtn: { backgroundColor: '#4f8cff', paddingVertical: 6, paddingHorizontal: 18, borderRadius: 16 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontFamily: 'ndot57' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, minHeight: 40, backgroundColor: '#fff', fontFamily: 'ndot57' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  taskInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  taskInput: { flex: 1, borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 10, backgroundColor: '#fff', fontFamily: 'ndot57' },
  addTaskBtn: { backgroundColor: '#4f8cff', marginLeft: 8, borderRadius: 8, padding: 10 },
  addTaskBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'ndot57' },
  taskList: { flex: 1 },
  taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 1 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#4f8cff', borderRadius: 6, marginRight: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  checkboxDone: { backgroundColor: '#4f8cff' },
  checkmark: { color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: 'ndot57' },
  taskText: { flex: 1, fontSize: 16, fontFamily: 'ndot57' },
  taskDone: { textDecorationLine: 'line-through', color: '#aaa' },
  removeBtn: { marginLeft: 8, padding: 4 },
  removeBtnText: { fontSize: 18 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 20, fontFamily: 'ndot57' },
});


