import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import Accordion from "react-native-collapsible/Accordion";
import {MaterialIcons} from "@expo/vector-icons";
import DropDownPicker from 'react-native-dropdown-picker';

const Sections_exchange = [
    {
        title: 'Có thể đổi hàng sau khi đã nhận hàng không?',
        content: 'Hiện tại fashion chưa hỗ trợ đổi hàng. Trong trường hợp sản phẩm nhận được có vấn đề ' +
            ', bạn có thể yêu cầu Trả hàng / Hoàn tiền ngay trên ứng dụng. Để hạn chế các rắc rối phát sinh ' +
            'liên quan đến trả hàng, Người mua lưu ý cần phải đóng gói theo quy định về đóng gói hàng hóa ' +
            'trong Chính Sách Vận Chuyển và gửi trả sản phẩm bao gồm toàn bộ phụ kiện đi kèm, hóa đơn VAT, ' +
            'tem phiếu bảo hành... nếu có và sản phẩm phải trong tình trạng nguyên vẹn như khi nhận hàng. ' +
            'Fasion khuyến khích Người mua quay video hoặc chụp lại ảnh sản phẩm ngay khi nhận được để làm ' +
            'bằng chứng đối chiếu / khiếu nại về sau nếu cần.',
    },
    {
        title: 'Không áp dụng đổi hàng với sản phẩm nào?',
        content: '-Sản phẩm mua đã quá thời hạn đổi theo quy định của hãng.\n' +
            '-Không có hóa đơn mua hàng.\n' +
            '-Sản phẩm không còn nhãn mác, phụ kiện, thẻ bài đính kèm. Sản phẩm sử dụng và bảo quản sai quy cách ' +
            'ghi trên HDSD ( In tem nhãn hàng hóa ), sản phẩm bị hư hỏng do va chạm hoặc ma sát với vật cứng ' +
            'làm trầy xước.\n' +
            '-Sản phẩm phụ kiện, sản phẩm là quà tặng khuyến mại.\n' +
            '-Sản phẩm đã qua sử dụng, sản phẩm bị dính bẩn, bị nhiễm mùi nước hoa, xà phòng, chất khử mùi cơ thể ' +
            'hay khói thuốc lá, hoặc các loại hóa mỹ phẩm khác…',
    },
    {
        title: 'Có thể trả lại hàng sau khi đã nhận hàng không?',
        content: 'Quý khách có thể trả lại sản phẩm đã mua tại fasion trong vòng 7 ngày kể từ khi nhận hàng' +
            ' với đa số sản phẩm (trừ những sản phẩm có quy định khác) khi thỏa mãn các điều kiện sau: \n\n' +
            '-Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của nhà sản xuất.\n' +
            '-Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).\n' +
            '-Sản phẩm không thanh toán bằng hình thức trả góp. \n' +
            '-Sản phẩm không nằm trong danh mục hạn chế đổi - trả.\n' +
            '-Để đảm bảo quyền lợi khách hàng và fashion có cơ sở làm việc với các bộ phận liên quan, ' +
            'tất cả yêu cầu trả sản phẩm quý khách cần cung cấp hình ảnh/clip sản phẩm. Fashion xin phép ' +
            'từ chối khi chưa nhận đủ thông tin hình ảnh từ quý khách.',
    },
];
const Sections_transport = [
    {
        title: 'Có thể đổi hàng sau khi đã nhận hàng không? 2',
        content: 'Hiện tại fashion chưa hỗ trợ đổi hàng. Trong trường hợp sản phẩm nhận được có vấn đề ' +
            ', bạn có thể yêu cầu Trả hàng / Hoàn tiền ngay trên ứng dụng. Để hạn chế các rắc rối phát sinh ' +
            'liên quan đến trả hàng, Người mua lưu ý cần phải đóng gói theo quy định về đóng gói hàng hóa ' +
            'trong Chính Sách Vận Chuyển và gửi trả sản phẩm bao gồm toàn bộ phụ kiện đi kèm, hóa đơn VAT, ' +
            'tem phiếu bảo hành... nếu có và sản phẩm phải trong tình trạng nguyên vẹn như khi nhận hàng. ' +
            'Fasion khuyến khích Người mua quay video hoặc chụp lại ảnh sản phẩm ngay khi nhận được để làm ' +
            'bằng chứng đối chiếu / khiếu nại về sau nếu cần.',
    },
    {
        title: 'Không áp dụng đổi hàng với sản phẩm nào?',
        content: '- Sản phẩm mua đã quá thời hạn đổi theo quy định của hãng.\n' +
            '- Không có hóa đơn mua hàng.\n' +
            '- Sản phẩm không còn nhãn mác, phụ kiện, thẻ bài đính kèm. Sản phẩm sử dụng và bảo quản sai quy cách ' +
            'ghi trên HDSD ( In tem nhãn hàng hóa ), sản phẩm bị hư hỏng do va chạm hoặc ma sát với vật cứng ' +
            'làm trầy xước.\n' +
            '- Sản phẩm phụ kiện, sản phẩm là quà tặng khuyến mại.\n' +
            '- Sản phẩm đã qua sử dụng, sản phẩm bị dính bẩn, bị nhiễm mùi nước hoa, xà phòng, chất khử mùi cơ thể ' +
            'hay khói thuốc lá, hoặc các loại hóa mỹ phẩm khác…',
    },
    {
        title: 'Có thể trả lại hàng sau khi đã nhận hàng không?',
        content: 'Quý khách có thể trả lại sản phẩm đã mua tại fasion trong vòng 7 ngày kể từ khi nhận hàng' +
            ' với đa số sản phẩm (trừ những sản phẩm có quy định khác) khi thỏa mãn các điều kiện sau: \n\n' +
            '- Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của nhà sản xuất.\n' +
            '- Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).\n' +
            '- Sản phẩm không thanh toán bằng hình thức trả góp. \n' +
            '- Sản phẩm không nằm trong danh mục hạn chế đổi - trả.\n' +
            '- Để đảm bảo quyền lợi khách hàng và fashion có cơ sở làm việc với các bộ phận liên quan, ' +
            'tất cả yêu cầu trả sản phẩm quý khách cần cung cấp hình ảnh/clip sản phẩm. Fashion xin phép ' +
            'từ chối khi chưa nhận đủ thông tin hình ảnh từ quý khách.',
    },
];
const Sections_order = [
    {
        title: 'Có thể đổi hàng sau khi đã nhận hàng không? 3',
        content: 'Hiện tại fashion chưa hỗ trợ đổi hàng. Trong trường hợp sản phẩm nhận được có vấn đề ' +
            ', bạn có thể yêu cầu Trả hàng / Hoàn tiền ngay trên ứng dụng. Để hạn chế các rắc rối phát sinh ' +
            'liên quan đến trả hàng, Người mua lưu ý cần phải đóng gói theo quy định về đóng gói hàng hóa ' +
            'trong Chính Sách Vận Chuyển và gửi trả sản phẩm bao gồm toàn bộ phụ kiện đi kèm, hóa đơn VAT, ' +
            'tem phiếu bảo hành... nếu có và sản phẩm phải trong tình trạng nguyên vẹn như khi nhận hàng. ' +
            'Fasion khuyến khích Người mua quay video hoặc chụp lại ảnh sản phẩm ngay khi nhận được để làm ' +
            'bằng chứng đối chiếu / khiếu nại về sau nếu cần.',
    },
    {
        title: 'Không áp dụng đổi hàng với sản phẩm nào?',
        content: '-Sản phẩm mua đã quá thời hạn đổi theo quy định của hãng.\n' +
            '-Không có hóa đơn mua hàng.\n' +
            '-Sản phẩm không còn nhãn mác, phụ kiện, thẻ bài đính kèm. Sản phẩm sử dụng và bảo quản sai quy cách ' +
            'ghi trên HDSD ( In tem nhãn hàng hóa ), sản phẩm bị hư hỏng do va chạm hoặc ma sát với vật cứng ' +
            'làm trầy xước.\n' +
            '-Sản phẩm phụ kiện, sản phẩm là quà tặng khuyến mại.\n' +
            '-Sản phẩm đã qua sử dụng, sản phẩm bị dính bẩn, bị nhiễm mùi nước hoa, xà phòng, chất khử mùi cơ thể ' +
            'hay khói thuốc lá, hoặc các loại hóa mỹ phẩm khác…',
    },
    {
        title: 'Có thể trả lại hàng sau khi đã nhận hàng không?',
        content: 'Quý khách có thể trả lại sản phẩm đã mua tại fasion trong vòng 7 ngày kể từ khi nhận hàng' +
            ' với đa số sản phẩm (trừ những sản phẩm có quy định khác) khi thỏa mãn các điều kiện sau: \n\n' +
            '-Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của nhà sản xuất.\n' +
            '-Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).\n' +
            '-Sản phẩm không thanh toán bằng hình thức trả góp. \n' +
            '-Sản phẩm không nằm trong danh mục hạn chế đổi - trả.\n' +
            '-Để đảm bảo quyền lợi khách hàng và fashion có cơ sở làm việc với các bộ phận liên quan, ' +
            'tất cả yêu cầu trả sản phẩm quý khách cần cung cấp hình ảnh/clip sản phẩm. Fashion xin phép ' +
            'từ chối khi chưa nhận đủ thông tin hình ảnh từ quý khách.',
    },
];
const Sections_payment = [
    {
        title: 'Có thể đổi hàng sau khi đã nhận hàng không? 4',
        content: 'Hiện tại fashion chưa hỗ trợ đổi hàng. Trong trường hợp sản phẩm nhận được có vấn đề ' +
            ', bạn có thể yêu cầu Trả hàng / Hoàn tiền ngay trên ứng dụng. Để hạn chế các rắc rối phát sinh ' +
            'liên quan đến trả hàng, Người mua lưu ý cần phải đóng gói theo quy định về đóng gói hàng hóa ' +
            'trong Chính Sách Vận Chuyển và gửi trả sản phẩm bao gồm toàn bộ phụ kiện đi kèm, hóa đơn VAT, ' +
            'tem phiếu bảo hành... nếu có và sản phẩm phải trong tình trạng nguyên vẹn như khi nhận hàng. ' +
            'Fasion khuyến khích Người mua quay video hoặc chụp lại ảnh sản phẩm ngay khi nhận được để làm ' +
            'bằng chứng đối chiếu / khiếu nại về sau nếu cần.',
    },
    {
        title: 'Không áp dụng đổi hàng với sản phẩm nào?',
        content: '-Sản phẩm mua đã quá thời hạn đổi theo quy định của hãng.\n' +
            '-Không có hóa đơn mua hàng.\n' +
            '-Sản phẩm không còn nhãn mác, phụ kiện, thẻ bài đính kèm. Sản phẩm sử dụng và bảo quản sai quy cách ' +
            'ghi trên HDSD ( In tem nhãn hàng hóa ), sản phẩm bị hư hỏng do va chạm hoặc ma sát với vật cứng ' +
            'làm trầy xước.\n' +
            '-Sản phẩm phụ kiện, sản phẩm là quà tặng khuyến mại.\n' +
            '-Sản phẩm đã qua sử dụng, sản phẩm bị dính bẩn, bị nhiễm mùi nước hoa, xà phòng, chất khử mùi cơ thể ' +
            'hay khói thuốc lá, hoặc các loại hóa mỹ phẩm khác…',
    },
    {
        title: 'Có thể trả lại hàng sau khi đã nhận hàng không?',
        content: 'Quý khách có thể trả lại sản phẩm đã mua tại fasion trong vòng 7 ngày kể từ khi nhận hàng' +
            ' với đa số sản phẩm (trừ những sản phẩm có quy định khác) khi thỏa mãn các điều kiện sau: \n\n' +
            '-Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của nhà sản xuất.\n' +
            '-Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).\n' +
            '-Sản phẩm không thanh toán bằng hình thức trả góp. \n' +
            '-Sản phẩm không nằm trong danh mục hạn chế đổi - trả.\n' +
            '-Để đảm bảo quyền lợi khách hàng và fashion có cơ sở làm việc với các bộ phận liên quan, ' +
            'tất cả yêu cầu trả sản phẩm quý khách cần cung cấp hình ảnh/clip sản phẩm. Fashion xin phép ' +
            'từ chối khi chưa nhận đủ thông tin hình ảnh từ quý khách.',
    },
];
const Sections_account = [
    {
        title: 'Có thể đổi hàng sau khi đã nhận hàng không? 5',
        content: 'Hiện tại fashion chưa hỗ trợ đổi hàng. Trong trường hợp sản phẩm nhận được có vấn đề ' +
            ', bạn có thể yêu cầu Trả hàng / Hoàn tiền ngay trên ứng dụng. Để hạn chế các rắc rối phát sinh ' +
            'liên quan đến trả hàng, Người mua lưu ý cần phải đóng gói theo quy định về đóng gói hàng hóa ' +
            'trong Chính Sách Vận Chuyển và gửi trả sản phẩm bao gồm toàn bộ phụ kiện đi kèm, hóa đơn VAT, ' +
            'tem phiếu bảo hành... nếu có và sản phẩm phải trong tình trạng nguyên vẹn như khi nhận hàng. ' +
            'Fasion khuyến khích Người mua quay video hoặc chụp lại ảnh sản phẩm ngay khi nhận được để làm ' +
            'bằng chứng đối chiếu / khiếu nại về sau nếu cần.',
    },
    {
        title: 'Không áp dụng đổi hàng với sản phẩm nào?',
        content: '-Sản phẩm mua đã quá thời hạn đổi theo quy định của hãng.\n' +
            '-Không có hóa đơn mua hàng.\n' +
            '-Sản phẩm không còn nhãn mác, phụ kiện, thẻ bài đính kèm. Sản phẩm sử dụng và bảo quản sai quy cách ' +
            'ghi trên HDSD ( In tem nhãn hàng hóa ), sản phẩm bị hư hỏng do va chạm hoặc ma sát với vật cứng ' +
            'làm trầy xước.\n' +
            '-Sản phẩm phụ kiện, sản phẩm là quà tặng khuyến mại.\n' +
            '-Sản phẩm đã qua sử dụng, sản phẩm bị dính bẩn, bị nhiễm mùi nước hoa, xà phòng, chất khử mùi cơ thể ' +
            'hay khói thuốc lá, hoặc các loại hóa mỹ phẩm khác…',
    },
    {
        title: 'Có thể trả lại hàng sau khi đã nhận hàng không?',
        content: 'Quý khách có thể trả lại sản phẩm đã mua tại fasion trong vòng 7 ngày kể từ khi nhận hàng' +
            ' với đa số sản phẩm (trừ những sản phẩm có quy định khác) khi thỏa mãn các điều kiện sau: \n\n' +
            '-Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác hay niêm phong của nhà sản xuất.\n' +
            '-Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng kèm theo (nếu có).\n' +
            '-Sản phẩm không thanh toán bằng hình thức trả góp. \n' +
            '-Sản phẩm không nằm trong danh mục hạn chế đổi - trả.\n' +
            '-Để đảm bảo quyền lợi khách hàng và fashion có cơ sở làm việc với các bộ phận liên quan, ' +
            'tất cả yêu cầu trả sản phẩm quý khách cần cung cấp hình ảnh/clip sản phẩm. Fashion xin phép ' +
            'từ chối khi chưa nhận đủ thông tin hình ảnh từ quý khách.',
    },
];

const FAQS = ({navigation}) => {

    const [sections, setSections] = useState([])
    const [activeSections, setActiveSections] = useState([])
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("exchange");
    const [items, setItems] = useState([
        {label: 'Đổi hàng', value: 'exchange'},
        {label: 'Vận chuyển', value: 'transport'},
        {label: 'Đặt hàng', value: 'order'},
        {label: 'Thanh toán', value: 'payment'},
        {label: 'Tài khoản', value: 'account'},
    ]);

    useEffect(() =>{
        if(value === 'exchange'){
            setSections(Sections_exchange)
        }
        if(value === 'transport'){
            setSections(Sections_transport)
        }
        if(value === 'order'){
            setSections(Sections_order)
        }
        if(value === 'payment'){
            setSections(Sections_payment)
        }
        if(value === 'account'){
            setSections(Sections_account)
        }
    },[value])

    const renderHeader = (section) => {
        return (
            <View style={[styles.header,{borderColor:
                    sections.findIndex(d => d.title === section.title) === 0 ? 'transparent': '#AEAEB2'}]}>
                <Text style={styles.headerText}>
                    {section.title}
                </Text>
                {activeSections.includes(section.title)
                    ? <MaterialIcons name="keyboard-arrow-down" size={24} color="black" style={styles.icon_down}/>
                    : <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
                }
            </View>
        );
    };

    const renderContent = (section) => {
        return (
            <View style={styles.content}>
                <Text>{section.content}</Text>
            </View>
        );
    }

    const updateSection = (section) => {
        setActiveSections(section)
    };

    return (
        <View style={styles.container} >
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 5}}>
                <Accordion
                    sections={sections}
                    activeSections={activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={updateSection}
                    underlayColor={'transparent'}
                    expandMultiple={true}
                    keyExtractor={(item) => item.title}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    header: {
        height: 40,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.5,
    },
    headerText: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 21,
        flex: 1,
    },
    content: {
        paddingBottom: 20,
    },
});

export default FAQS;
