Deno.serve({
    port: 80,
    handler: async (request) => {
        if (request.headers.get("upgrade") === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(request);

            socket.onopen = () => {
                console.log("CONNECTED");
            }
            socket.onmessage = (event) => {
                console.log(`RECEIVED: ${event.data}`);
                socket.send("pong");
            }
            socket.onclose = () => console.log("DISCONNECTED");
            socket.onerror = (error) => console.error("ERROR:", error);

            return response;
        } else {
            const file = await Deno.open("./index.html", { read: true });
            return new Response(file.readable);
        }
    }
});