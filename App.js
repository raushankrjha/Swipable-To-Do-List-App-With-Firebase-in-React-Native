import React from 'react';
import { StyleSheet, View, StatusBar, ListView,ImageBackground } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Icon, List, ListItem,Card, CardItem, Text, Body,Right,Left,Thumbnail } from 'native-base'

import * as firebase from 'firebase';
 //initiize firebase
const firebaseconfig=
{
   apiKey: "AIzaSyCqvf6pvtRc0A7vZ4oIqldzb1VKB5LxJ2k",
    authDomain: "fir-authwithreactnative.firebaseapp.com",
    databaseURL: "https://fir-authwithreactnative.firebaseio.com",
    projectId: "fir-authwithreactnative",
    storageBucket: "fir-authwithreactnative.appspot.com",
    messagingSenderId: "887313025101"
};
firebase.initializeApp(firebaseconfig);


var data = []

export default class App extends React.Component {

  componentDidMount() {

    var that = this

    firebase.database().ref('/todolist').on('child_added', function (data) {

      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData })

    })

  }

  //create constructor
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      listViewData: data,
      newnotes: ""
    }

  }

    //add notes
  addNotes(data) {

    var key = firebase.database().ref('/todolist').push().key
    firebase.database().ref('/todolist').child(key).set({ title: data })
  }

      //delete data from list
  async deleteRow(secId, rowId, rowMap, data) {

    await firebase.database().ref('todolist/' + data.key).set(null)

    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData });

  }




  render() {
    return (
      <Container style={styles.container}>
        <ImageBackground source={require('./assets/background.png')} style={{ flex: 1,
      width: null,
      height: null,
      }} >

        <Header style={{ marginTop: StatusBar.currentHeight }}>
          <View style={{flex:1,margin:2,backgroundColor:"black"}}>
          <Card>
          <CardItem   bordered >
              <Input
                onChangeText={(newnotes) => this.setState({ newnotes })}
                placeholder="Title"
              />
              <Right>
              <Button onPress={() => this.addNotes(this.state.newnotes)}>
                <Icon name="add" />
              </Button>
              </Right>

             
           </CardItem>
            </Card>
         </View>
        </Header>

        <View style={{flex:1,marginTop:30,margin:5}} >
          <List
  
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <Card style={{height:70}}>
             <CardItem button onPress={() => alert("Thanks")} style={{height:70}}>
            
             
                <Text style={{ fontWeight: 'bold', fontSize: 18,}}> {data.val().title}</Text>
               
              </CardItem>
              </Card>
            }
            
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon name="trash" />
              </Button>

            }

          
            rightOpenValue={-90}

          />

        </View>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
});