import {Server} from "socket.io";
import dbConnect from "../database";
import {ObjectId} from "mongodb";
import Message from "../models/Message";
import User from "../models/User";
import errorConsole from "../logger/errorConsole";
import Status from "../models/Status";

let socketS;


let tasks = [
// 	{
// 	time: new Date(),
// 	status: "leave",
// 	socketId: "21321"
// 	user_id: ""
// }
]

function backgroundTask(){

}


export function socketInitiate(httpServer, app) {
	
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.NODE_ENV === "development" ? "http://localhost:2000" :  process.env.FRONT_END,
			// origin: process.env.NODE_ENV === "development" ? "http://192.168.43.170:2000" :  process.env.FRONT_END,
			methods: ["GET", "POST"]
		}
	});
	
	let delayList = new Map()
	
	
	async function delayDataBaseAction(socketId) {
		
		
		let client;
		try {
			let {c: StaticCollection, client: cc} = await dbConnect("status")
			client = cc
			let status = await StaticCollection.findOne({socket_id: socketId})
			if (status) {
				let updatedStatus = await StaticCollection.updateOne(
					{socket_id: socketId},
					{
						$set: {
							is_online: false,
							last_online: new Date(),
						}
					})
				console.log(updatedStatus)
			}
			io.to("member").emit("leave-msg", {socket_id: socketId})
			
		} catch (ex) {
		
		} finally {
			client && client.close()
		}
	}


// function delaySetUnActiveUser(socketId){
//   delayList.set(socketId, {
//     fn: (id)=> delayDataBaseAction(id),
//     time: Date.now() + 3600,
//   })
//
//   delayList.forEach((value, key)=>{
//     // delayList.delete(key)
//   })
// }
//
	let id;
	
	io.on("connection", (socket) => {
		console.log(socket.id, " added ")
		
		socketS = socket
		
		app.set("socket", socket)
		
		socket.on("join-room", (room) => {
			socket.join(room)
		})
		
		socket.on("join-member-room", async ({room, user_id}) => {
			
			if (room) {
				socket.join(room)
				io.to(room).emit("status-msg", user_id)
				socket["user_id"] = user_id
				
				Status.update(
				{user_id: new ObjectId(user_id)},
				{
					$set: {
						socket_id: socket.id,
						is_online: true,
					}
				}).then(doc=>{
					// console.log(doc)
				}).catch(ex=>{
					console.log(ex)
				})
				
				
				// change database status collection active status...
				// let client;
				//
				// try {
				// 	let {c: StaticCollection, client: cc} = await dbConnect("status")
				// 	client = cc
				// 	let status = await StaticCollection.findOne({user_id: new ObjectId(user_id)})
				//
				// 	if (status) {
				// 		let updatedStatus = await StaticCollection.updateOne(
				// 			{user_id: new ObjectId(user_id)},
				// 			{
				// 				$set: {
				// 					socket_id: socket.id,
				// 					is_online: true
				// 				}
				// 			})
				// 	} else {
				// 		let newStatus = await StaticCollection.insertOne({
				// 			user_id: new ObjectId(user_id),
				// 			is_online: true,
				// 			last_online: new Date(),
				// 			socket_id: socket.id
				// 		})
				// 		console.log(newStatus, "daasd")
				// 	}
				// } catch (ex) {
				// 	console.log(ex)
				// } finally {
				// 	client && client.close()
				// }
			
			}
		})
		
		
		// event listener for who turn off him self
		socket.on("visibility", (data: {user_id: string, in_visible: boolean})=>{
		
			const user_id = socket["user_id"]
			io.to("member").emit("visibility", {user_id: user_id, in_visible: data.in_visible})

			Status.update(
				{user_id: new ObjectId(user_id)},
				{
					$set: {
						socket_id: socket.id,
						in_visible:  data.in_visible
					}
				})
				.then(doc=>{})
				.catch(ex=>{})
		})
		
		// server send to connected client
		// socket.emit("message", "Welcome Mr. " + socket.id)
		
		socket.on("message", async (data) => {
			let {text, room, to, from} = data
			// socket.broadcast.emit send all client but not own client who emit message
			
			try {
				let newMsg = new Message({
					text: text,
					created_at: new Date(),
					to: new ObjectId(to),
					from: new ObjectId(from),
					room: room
				})
				let doc: any = await newMsg.save()
				if (doc) {
					let fromJoin = await User.aggregate([
						{$match: {_id: new ObjectId(from)}},
						{$project: {_id: 1, avatar: 1, username: 1, first_name: 1, last_name: 1}}
					])
					doc.from = fromJoin[0]
					
					let toJoin = await User.aggregate([
						{$match: {_id: new ObjectId(from)}},
						{$project: {_id: 1, avatar: 1, username: 1, first_name: 1, last_name: 1}}
					])
					doc.to = toJoin[0]
					
					io.to(room).emit("msg", doc);
				}
			} catch (ex) {
				errorConsole(ex)
			}
			// socket.broadcast.emit("all-message", data)
			// socket.emit("all-message", data)
		})
		
		
		// leave room when user close tab or refresh browser window...
		socket.on('disconnect', async function (d) {
			// const user_id = socket["user_id"]
			//
			// socket.disconnect()
			// io.to("member").emit("leave-msg", user_id)
			//
			// Status.update(
			// 	{user_id: new ObjectId(user_id)},
			// 	{
			// 		$set: {
			// 			socket_id: socket.id,
			// 			is_online: false
			// 		}
			// 	}).then(doc=>{
			// 	// console.log(doc)
			// }).catch(ex=>{
			// 	// console.log(ex.message)
			// })
			
		})
		
		// socket.on('disconnect', async function (d) {
		//
		// 	console.log('Socket disconnected', socket.id);
		// 	console.log(d)
		// 	tasks.push({
		// 		time: new Date(),
		// 		user_id: null,
		// 		status: "leave",
		// 		socketId: socket.id
		// 	})
		//
		//
		// 	socket.disconnect()
		// 	io.to("member").emit("leave-msg", {socket_id: socket.id})
		//
		// 	tasks.forEach(task=>{
		// 		console.log(task)
		// 		if(task.status === "leave"){
		// 			Status.update(
		// 				{socket_id: socket.id},
		// 				{
		// 					$set: {
		// 						socket_id: socket.id,
		// 						is_online: false
		// 					}
		// 				}).then(doc=>{
		// 				console.log(doc)
		// 			}).catch(ex=>{
		// 				console.log(ex)
		// 			})
		// 		}
		// 	})
		//
		// 	tasks = tasks.filter(task=>task.socketId !== socket.id)
		//
		//
		// 	// it should be delay 2s or 3s. because prevent database action when user reload browser tab
		// 	// delayDataBaseAction(socket.id)
		//
		//
		// });
		
		// manually leave room
		socket.on("user-leave", (data)=>{
			const user_id = socket["user_id"]
			console.log('Socket disconnected', user_id);
			socket.disconnect()
			io.to("member").emit("leave-msg", user_id)
			
			Status.update(
				{user_id: new ObjectId(user_id)},
				{
					$set: {
						socket_id: socket.id,
						is_online: false
					}
				}).then(doc=>{
				// console.log(doc)
			}).catch(ex=>{
				// console.log(ex.message)
			})
			
		// socket.on("leave", async ({room, user_id})=>{
		//   console.log("user leave ", user_id)
		//
		//   if(room === "member"){
		//     try {
		//       let { Collection, client } = await User.getCollection()
		//       let doc = await Collection.updateOne({_id: new ObjectId(user_id)}, {$set: { isOnline: false }})
		//       // console.log(doc)
		//     } catch (ex){
		//
		//     }
		//   }
		//   console.log("leave room", room)
		//   io.to(room).emit("leave-msg", {member_id: user_id, isOnline: false })
		//   socket.disconnect(reason=>{})
		})
		
	});
}

export default socketS