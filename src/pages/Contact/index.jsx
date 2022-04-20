import React, { useRef } from 'react'
import FormInput from '../../components/Forms/FormInput'
import FormTextArea from '../../components/Forms/FormTextArea'
import Button from '../../components/Forms/Button'
import "./style_contact.scss"
import emailjs from '@emailjs/browser';

function Contact() {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_mzvw71v', 'template_g0y57ex', form.current, 'GhzWd9d83HveJte0q')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        form.current.reset()
        alert("Email đã được gửi tới admin, admin sẽ liên lạc với bạn thông qua email mà bạn đã nhập trong một vài ngày tới.")
    }

    return (
        <form className='contact' ref={form} onSubmit={sendEmail}>
            <h2>
                Liên hệ
            </h2>

            <p>
                Nếu bạn muốn liên lạc với admin để bàn về kế hoạch hợp tạc thì hãy để chủ đề là Hợp tác
            </p>

            <p>
                Còn lại nếu không liên quan gì đến hợp tác, thì cứ để là Hỏi đáp (Nếu bạn muốn hỏi điều gì đó), Đóng góp (Nếu bạn muốn đóng góp ý kiến gì với page)
            </p>

            <p>
                * Chú ý: Hãy sử dụng email thật của bạn, nếu có thể hãy ghi thêm một vài cách thức liên lạc khác với bạn ở phần nội dung, như thế chúng tôi sẽ dễ dàng tương tác với bạn hơn, xin chân thành cảm ơn.
            </p>

            <FormInput
                label={"Tên"}
                type="text" 
                name="from_name"
                required="required"
                placeholder="Tên tài khoản"
            />

            <FormInput
                label={"Email của bạn"}
                type="email" 
                name="email"
                required="required"
                placeholder="Email"
            />

            <FormInput
                label={"Chủ đề"}
                name="subject"
                required="required"
                placeholder="Chủ đề"
            />

            <FormTextArea
                label={"Nội dung"}
                name="message"
                required="required"
                placeholder="Điền nội dung tại đây..."
            />
            
            <Button
                type="submit" 
                value="Send"
            >
                Gửi
            </Button>
        </form>
    )
}

export default Contact