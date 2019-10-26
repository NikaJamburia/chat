
window.addEventListener('load',function(){

    document.getElementById('sendMsg').addEventListener('click', function(e){
        e.preventDefault();
        
        if(document.getElementById('body').value == ""){
            return 0;
        }
        else{
            chat_id = document.getElementById('chat_id').value;
            body = document.getElementById('body').value;

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'chat/', true);
        
            var metas = document.getElementsByTagName('meta');
            for (i=0; i<metas.length; i++) { 
                if (metas[i].getAttribute("name") == "csrf-token") {  
                    xhr.setRequestHeader("X-CSRF-Token", metas[i].getAttribute("content"));
                } 
            }
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            var params = "chat_id="+chat_id+"&body="+body;
        

            xhr.onload = function(){
                if(this.status == 200){
                    var msgs = JSON.parse(this.responseText);

                    output = "";
                    for(var i in msgs){
                        if(msgs[i].sender_id == userid){
                            output += "<div class='mb-3'>"+
                                         "<div class='clearfix '>"+
                                             "<div class='bg-primary p-2 float-right ml-auto text-white msg'>"+
                                                 msgs[i].body+
                                             "</div>  "+
                                         "</div>"+
                                         "<div class='clearfix'>"+
                                             "<small class=' float-right ml-2'>"+msgs[i].created_at+"</small>"+
                                         "</div>"+
                                         "</div>";
                        }
                        else{
                         output += "<div class='mb-3'>"+
                                     "<div class='clearfix d-flex items-align-content-center'>"+
                                         "<div class='bg-reply p-2 float-left text-dark msg'>"+
                                             msgs[i].body+
                                         "</div>  "+
                                         
                                     "</div>"+
                                     "<div class='clearfix'>"+
                                         "<small class=' float-left mr-2'>"+msgs[i].created_at+"</small>"+
                                     "</div>"+
                                     "</div>";
                        }
                    }
                    if (msgs[i].sender_id == userid && msgs[i].status == 'Seen'){
                        output += "<div class='clearfix'> <small class='float-right'>"+msgs[i].status+" at "+msgs[i].updated_at+" </small> </div>";
                    }
                    child = document.getElementById('flex'+chat_id).children;
                    for(var i in child){
                        console.log(child[i]);
                        if(child[i].tagName == "SMALL"){
                            child[i].innerHTML = body;
                            break;
                        }
                    }
                    document.getElementById('body').value = "";
                    document.getElementById('body').innerHTML = "";

                    document.getElementById('msg-box').innerHTML = output;
                    document.getElementById('msg-box').scrollTop = document.getElementById('msg-box').scrollHeight;
                }
            }
            xhr.send(params);
        }
    });

    
});

function showChat(event){
    chatId = event.currentTarget.id;
    userid = document.getElementById('user_id').value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'chat/'+chatId, true);

    var metas = document.getElementsByTagName('meta');
    for (i=0; i<metas.length; i++) { 
        if (metas[i].getAttribute("name") == "csrf-token") {  
            xhr.setRequestHeader("X-CSRF-Token", metas[i].getAttribute("content"));
        } 
    }

    xhr.onload = function(){
        if(this.status == 200){
            if(this.responseText == "No Messages yet"){
                output = this.responseText;
            }
            else{
                var msgs = JSON.parse(this.responseText);

                output = "";
                for(var i in msgs){
                    if(msgs[i].sender_id == userid){
                        output += "<div class='mb-3'>"+
                                     "<div class='clearfix '>"+
                                         "<div class='bg-primary p-2 float-right ml-auto text-white msg'>"+
                                             msgs[i].body+
                                         "</div>  "+
                                     "</div>"+
                                     "<div class='clearfix'>"+
                                         "<small class=' float-right ml-2'>"+msgs[i].created_at+"</small>"+
                                     "</div>"+
                                     "</div>";
                    }
                    else{
                     output += "<div class='mb-3'>"+
                                 "<div class='clearfix d-flex items-align-content-center'>"+
                                     "<div class='bg-reply p-2 float-left text-dark msg'>"+
                                         msgs[i].body+
                                     "</div>  "+
                                     
                                 "</div>"+
                                 "<div class='clearfix'>"+
                                     "<small class=' float-left mr-2'>"+msgs[i].created_at+"</small>"+
                                 "</div>"+
                                 "</div>";
                    }
                }
                if (msgs[i].sender_id == userid && msgs[i].status == 'Seen'){
                    output += "<div class='clearfix'> <small class='float-right'>"+msgs[i].status+" at "+msgs[i].updated_at+" </small> </div>";
                }

            }
                 
            document.getElementById('msg-box').innerHTML = output;
            document.getElementById('msg-box').scrollTop = document.getElementById('msg-box').scrollHeight;
            document.getElementById('chat_id').value = chatId;

            document.getElementById('body').removeAttribute('disabled');
            document.getElementById('sendMsg').removeAttribute('disabled');
            try {
                document.getElementById('msgsBadge').classList.add('fade');
            } catch (error) {
                return 0;
            }

        }
    }

    xhr.send();
}



