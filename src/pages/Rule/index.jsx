import React from 'react'
import AdOnTop from '../../components/DisplayAd/AdOnTop'
import Image from "../../assets/16526305592141308214.png"
import "./style_rule.scss"


function Rule() {
  return (
    <div className='rule'>
      <div className='rule_ad'>
          <AdOnTop
              Image={Image}
              Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
          />
      </div>
      <h2>
        Luật
      </h2>
      <p>
        Dưới đây là một số điều luật mong các bạn sẽ cân nhắc trước khi đăng bài, hoặc sử dụng các chức năng bình luận
      </p>
      <p style={{color: "red"}}>
        Tiện đây thì, tôi, đại diện admin xin nói luôn là mục đích của trang này được tạo ra là để những thành viên người việt có thể chia sẻ các hiệu ứng, animation, green screen animation, 
        hình ảnh được chính họ vẽ ra,... có thể nói đây là nơi cho các creator có thể dạo chơi, lấy ý kiến, chia sẻ kinh nghiệm, tiếp thu cái mới hoặc để tìm các creator khác là người việt để hợp tác với nhau trước khi họ muốn đặt chân vào các sân chơi lớn hơn 
        (còn sân chơi đó là gì thì hẳn ai cũng biết rồi) và kiếm tiền bằng nó.
      </p>
      <p>
        1. Không Spam
      </p>
      <p>
        2. Tôn trọng lẫn nhau, chúng tôi không chấp nhận bất kì hành vi nào xúc phạm lẫn nhau trong website này, các hành vi đăng nội dung hoặc bình luận dùng để xúc phạm nhau đều tuyệt đối nghiêm cấm
      </p>
      <p>
        3. Các bạn có thể đăng meme, video, hình ảnh nhưng tuyệt đối đừng đem vấn đề chính trị vào, nó phiền phức lắm
      </p>
      <p>
        4. Các bạn có thể lấy nội dung từ những nguồn khác, miễn là bạn có ghi credit đầy đủ kèm đường link thì mọi thứ đều ổn
      </p>
      <p>
        5. Hãy nhớ dung lượng của mọi trang đều như nhau, chúng đều không vô hạn, thế nên dừng ngay những hành động lấy nội dung lẫn nhau hay đăng những nội dung không liên quan tới mục đích chính của trang đi
      </p>
      <p>
        6. Nếu bạn muốn giúp trang và muốn kiếm tiền cùng admin thì hãy liên lạc với admin và bàn bạc sâu hơn về vấn đề này
      </p>
    </div>
  )
}

export default Rule