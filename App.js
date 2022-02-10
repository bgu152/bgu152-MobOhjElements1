import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList,SafeAreaView, StatusBar} from 'react-native';

import { Input, Button, ListItem, Header } from 'react-native-elements';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ostokset1.db');

export default function App() {
  const [ostos, setOstos] = useState('');
  const [maara, setMaara] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists course (id integer primary key not null, ostos text, maara text);');
    });
    updateList();    
  }, []);

  // Save course
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into course (ostos, maara) values (?, ?);', [ostos, maara]);    
      }, null, updateList
    )
  }

  // Update courselist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from course;', [], (_, { rows }) =>
        setCourses(rows._array)
      ); 
      setOstos('');
      setMaara('');
      
    });
  }

  // Delete course
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from course where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  const renderItem = ({ item }) => (
    <ListItem style={styles.listcontainer} bottomDivider>
      <ListItem.Content>
        <ListItem.Title style={{fontSize: 18}} >{item.ostos}</ListItem.Title>
        <View style={styles.listItemcontainer}>
        <ListItem.Subtitle>{item.maara}</ListItem.Subtitle>
        </View>
        
        <ListItem>
        <Button
              icon={{
                name: 'remove',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              title="Poista"
              onPress={() => deleteItem(item.id)} 
        />
        </ListItem>
        
        
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        centerComponent={{ text: 'OSTOSLISTA', style: { color: '#fff' } }}
      />
      <Input placeholder='Ostos' label='KIRJAA OSTOS'
        onChangeText={ostos => setOstos(ostos)}
        value={ostos} />
      <Input placeholder='Määrä' label='ANNA MÄÄRÄ'
        onChangeText={maara => setMaara(maara)}
        value={maara} />     
      <Button raised icon={{ name: 'save' }} title='Lisää' onPress={saveItem}></Button> 
      
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={renderItem}
        data={courses} 
        ItemSeparatorComponent={listSeparator} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
 listcontainer: {
  flex:1,
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
 listItemcontainer: {
   flex:1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
 }
});