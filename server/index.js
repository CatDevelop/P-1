const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
let rooms = []
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log("[SERVER] Новое подключение: ", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data.room);
        console.log("[SERVER] ", socket.id, " присоединился к комнате №", data.room)

        let room = rooms.find(x => x.id === data.room)
        let roomIndex = rooms.findIndex(x => x.id === data.room)

        if(room)
            rooms[roomIndex].users.push({id: socket.id})
        else
            rooms.push({id: data.room, users: [{id: socket.id}]})
        console.log("[SERVER] Текущее состояние комнат: ", rooms )
    });

    socket.on("editBlocks", (data) => {
        socket.to(data.room).emit("editBlocks", data);
        console.log("[USER] ", socket.id, " изменил ", data.blocks.length, " блоков в ", data.room, " комнате")
    });

    socket.on("deleteBlocks", (data) => {
        socket.to(data.room).emit("deleteBlocks", data);
        console.log("[USER] ", socket.id, " удалил ", data.blocks.length, " блоков в ", data.room, " комнате")
    });

    socket.on("disconnect", (data) => {
        console.log("[SERVER] ", socket.id, " отсоединился от сервера ")
        rooms.map((room, roomId) => {
            room.users.map((user, id) => {
                if(user.id === socket.id)
                    rooms[roomId] = {id: rooms[roomId].id, users: rooms[roomId].users.filter(x => x.id !== socket.id)}
            })
        })
        console.log("[SERVER] Текущее состояние комнат: ", rooms )
    });
});

server.listen(3001, () => {
    console.log("[SERVER] Running on 3001 port");
});
