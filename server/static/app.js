(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                if(_this.message_side=='right'){
                    $message = $($('.message_template_right').clone().html());
                }
                else{
                    $message = $($('.message_template_left').clone().html());
                }
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, printMessage;
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        printMessage = function (text, message_side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        sendMessage = function (text) {
            response_text = ''
            $.ajax({
                    url:"response",
                    type:"POST",
                    data:JSON.stringify(text),
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data){
                                timer = data.split('\\n')[0].split(' ').length * 250;
                                data.split('\\n').forEach(function (item, index) {
                                    setTimeout(function (){return printMessage(item, 'left')}, timer);
                                    timer += (item.split(' ').length)*250;
                                });
                            }
            });
            return response_text;
        };
        $('.send_message').click(function (e) {
            input_text = getMessageText();
            printMessage(input_text, 'right');  //print input
            sendMessage(input_text); //print response
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                input_text = getMessageText();
                printMessage(input_text, 'right');  //print input
                sendMessage(input_text); //print response
            }
        });
        sendMessage('');
    });
}.call(this));