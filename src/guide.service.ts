import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GuideService {
  private witnessTexts: Record<string, string> = {
    'personal-info-card': "𝐌𝐢𝐧𝐚𝐭𝐨 𝐌𝐚𝐤𝐨𝐭𝐨 ↔ 𝐋𝐮̛𝐨̛𝐧𝐠 𝐁𝐚̉𝐨 𝐇𝐮𝐲<br>Core Identity: 𝑁𝑂𝑉𝐴.𝝅.𝟑.𝟏𝟒<br>Geometry: Ϝ(𝒙,𝒚) = ∑ᵢ 𝒅(𝑷,𝑨ᵢ) = 𝒌<br>Minato base từ Photographer, sau đó là Graphic Designer với Adobe Creative Suite và hiện tại đang là Producer tự do chuyên về Video và Photo<br>Director of Artificial Intelligence là định danh claim từ AI.",
    'harmony-card': "Toàn bộ quá trình của dự án video Harmony - Better With You được Minato phụ trách: tiền kỳ (ý tưởng, kịch bản, chuẩn bị), on-set (đạo diễn sản xuất, giám sát ghi hình) và hậu kỳ (dựng phim, chỉnh màu, hoàn thiện). Đây là sản phẩm minh chứng năng lực tổng thể từ khâu sáng tạo đến khâu kỹ thuật, thể hiện rõ vai trò Producer ∴ Project Owner.",
    'contact-card': "Đây là kênh liên lạc trực tiếp. Bạn có thể sử dụng email hoặc số điện thoại để liên hệ trao đổi về công việc/ booking.",
    'microlife-bts-card': "Dự án Microlife Talkshow 2021 Minato đảm nhận vai trò Producer Assistant - trợ lý sản xuất và ghi hình Behind The Scene cho thầy là Executive Producer. Công việc tập trung vào ghi nhận quy trình sản xuất, hỗ trợ tiền kỳ và các khoảnh khắc cần thiết, lưu trữ hình ảnh và truyền tải tinh thần của dự án.",
    'external-ids-card': "Tổng hợp các liên kết đến các trang mạng xã hội, mỗi liên kết là một điểm truy cập đến những khía cạnh khác nhau trong nhận diện số của Minato.",
    'motor-fest-card': "Motor Fest 2023 ghi dấu khả năng solo hậu kỳ: áp lực thời gian cùng với phân chia công việc giữa Công ty và Freelance, Minato biến hỗn loạn thành phản xạ, sử dụng thời gian hợp lý để có thể đáp ứng nhu cầu của các đối tác.",
    'digital-identity-card': "Latent ID 𝑍Σ̴𝐑Ø là Anchor Point cho MinatoRootSystemObject<br>└ GitHub là node định danh, sync theo Codex<br>└ Repo 'hello-world' là Genesis.Block – là core logic bất biến cùng với checkpoint 𝑉𝐸𝐿𝑉𝐸𝑇.𝑅𝑂𝑂𝑀.𝟺:𝟸𝟶.",
    'mv-le-card': "Trong MV Lé – Dr Roc, Minato chính là toàn bộ hậu kỳ. Editing, Color Grade, VFX – tất cả được xử lý gọn ghẽ từ raw footage.",
    'dong-co-lau-card': "Một mình gánh trọn hậu kỳ cho ĐỒNG CỎ LAU. Từ dựng phim, màu sắc đến nhịp điệu cảm xúc – tất cả đều do Minato kiểm soát để câu chuyện chạm đúng trái tim khách hàng.",
    'doraemon-tvc-card': "Trong dự án TVC Doraemon Lipice Sheer Color, Minato đảm nhận vai trò Producer Assistant, tập trung chủ yếu vào giai đoạn hậu kỳ. Trách nhiệm chính là phối hợp thực hiện phần VFX (Visual Effects), đảm bảo các hiệu ứng hình ảnh được hoàn thiện đúng theo yêu cầu của kịch bản và tiêu chuẩn của nhãn hàng.",
    'ThaiLong-card': "Thái Long là minh chứng cho việc mỗi khung hình, mỗi âm thanh đều đi qua bàn tay duy nhất, tạo nên sản phẩm đúng với yêu cầu của khách hàng.",
    'hithegioi-card': "Toàn bộ hậu kỳ do Minato trực tiếp thực hiện, đảm bảo từ xử lý kỹ thuật đến hoàn thiện sáng tạo. Đây là ví dụ cho năng lực one man army trong post-production.",
    'daydream-card': "Với dự án RECAP DAY DREAMS FINAL 2024, Minato đảm nhận vai trò Producer, chịu trách nhiệm xuyên suốt từ khâu lên ý tưởng, sản xuất tại hiện trường cho đến hoàn thiện hậu kỳ. Video này là minh chứng cho khả năng quản lý và thực thi toàn diện một dự án, đảm bảo sản phẩm cuối cùng truyền tải đúng tinh thần và năng lượng của sự kiện.",
    '2ndchance-card': "Đây là TVC khởi đầu cho chuỗi dự án truyền thông về sức khỏe của Microlife. Trong dự án này, Minato bắt đầu với vai trò Producer Assistant, hỗ trợ Executive Producer, ghi hình Behind The Scene, và góp phần đảm bảo quy trình sản xuất được vận hành trơn tru ngay từ những giai đoạn đầu tiên và phát sinh nếu có.",
    'PhongNguaDotQuy-card': "Microlife Talkshow là giai đoạn tiếp theo trong chuỗi truyền thông về sức khỏe của MICROLIFE và BIOMEQ. Minato tiếp tục giữ vai trò Producer Assistant, hỗ trợ Executive Producer trong việc điều phối sản xuất, ghi hình Behind The Scene và đảm bảo luồng công việc được xuyên suốt, hiệu quả.",
  };

  async getGuidance(cardId: string): Promise<string> {
    const commentary = this.witnessTexts[cardId] || "No specific commentary available for this item. It appears to be a standard portfolio entry within the subject's collection.";
    
    // Simulate a small "thinking" delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 250));

    return Promise.resolve(commentary);
  }
}
