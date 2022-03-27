import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';

const addressList = [
    {id: '0001',name:'Hà Nội', district: [
            {id: '010001', name: 'Quận Ba Đình' , ward: [
                    {id: '01010001', name: 'Cống Vị'},
                    {id: '02010001', name: 'Điện Biên'},
                    {id: '03010001', name: 'Đội Cấn'},
                    {id: '04010001', name: 'Giảng Võ'},
                    {id: '06010001', name: 'Kim Mã'},
                    {id: '07010001', name: 'Liễu Giai'},
                    {id: '08010001', name: 'Ngọc Hà'},
                    {id: '09010001', name: 'Ngọc Khánh'},
                ]},
            {id: '020001', name: 'Quận Bắc Từ Liêm', ward: [
                    {id: '01020001', name: 'Cổ Nhuế 1'},
                    {id: '02020001', name: 'Cổ Nhuế 2'},
                    {id: '03020001', name: 'Đông Ngạc'},
                    {id: '04020001', name: 'Đức Thắng'},
                    {id: '06020001', name: 'Liên Mạc'},
                    {id: '07020001', name: 'Minh Khai'},
                    {id: '08020001', name: 'Phú Diễn'},
                    {id: '09020001', name: 'Phúc Diễn'},
                ]},
            {id: '030001', name: 'Quận Cầu Giấy', ward: [
                    {id: '01030001', name: 'Nghĩa Đô'},
                    {id: '02030001', name: 'Quan Hoa'},
                    {id: '03030001', name: 'Dịch Vọng Hậu'},
                    {id: '04030001', name: 'Trung Hòa'},
                    {id: '06030001', name: 'Nghĩa Tân'},
                    {id: '07030001', name: 'Mai Dịch'},
                    {id: '08030001', name: 'Yên Hòa'},
                ]},
            {id: '040001', name: 'Quận Đống Đa', ward: [
                    {id: '01040001', name: 'Văn Miếu'},
                    {id: '02040001', name: 'Quốc Tử Giám'},
                    {id: '03040001', name: 'Hàng Bột'},
                    {id: '04040001', name: 'Nam Đồng'},
                    {id: '06040001', name: 'Trung Liệt'},
                    {id: '07040001', name: 'Khâm Thiên'},
                    {id: '08040001', name: 'Phương Liên'},
                    {id: '09040001', name: 'Phương Mai'},
                ]},
            {id: '050001', name: 'Quận Hà Đông', ward: [
                    {id: '01050001', name: 'Quang Trung'},
                    {id: '02050001', name: 'Nguyễn Trãi'},
                    {id: '03050001', name: 'Hà Cầu'},
                    {id: '04050001', name: 'Vạn Phúc'},
                    {id: '06050001', name: 'Phúc La'},
                    {id: '07050001', name: 'Yết Kiêu'},
                    {id: '08050001', name: 'Mộ Lao'},
                    {id: '09050001', name: 'Văn Quán'},
                ]},
            {id: '060001', name: 'Quận Hai Bà Trưng', ward: [
                    {id: '01060001', name: 'Quang Trung'},
                    {id: '02060001', name: 'Nguyễn Trãi'},
                    {id: '03060001', name: 'Hà Cầu'},
                    {id: '04060001', name: 'Vạn Phúc'},
                    {id: '06060001', name: 'Phúc La'},
                    {id: '07060001', name: 'Yết Kiêu'},
                    {id: '08060001', name: 'Mộ Lao'},
                    {id: '09060001', name: 'Văn Quán'},
                ]},
            {id: '070001', name: 'Quận Hoàn Kiếm', ward: [
                    {id: '01070001', name: 'Chương Dương Độ'},
                    {id: '02070001', name: 'Cửa Đông'},
                    {id: '03070001', name: 'Cửa Nam'},
                    {id: '04070001', name: 'Đòng Xuân'},
                    {id: '06070001', name: 'Hàng Bạc'},
                    {id: '07070001', name: 'Hàng Bài'},
                    {id: '08070001', name: 'Hàng Bồ'},
                    {id: '09070001', name: 'Hàng Bông'},
                ]},
            {id: '080001', name: 'Quận Hoàng Mai', ward: [
                    {id: '01080001', name: 'Định Công'},
                    {id: '02080001', name: 'Đại Kim'},
                    {id: '03080001', name: 'Giáp Bát'},
                    {id: '04080001', name: 'Đại Liệt'},
                    {id: '06080001', name: 'Hoàng Văn Thụ'},
                    {id: '07080001', name: 'Lĩnh Nam'},
                    {id: '08080001', name: 'Mai Động'},
                    {id: '09080001', name: 'Tân Mai'},
                ]},
            {id: '090001', name: 'Quận Hà Đông', ward: [
                    {id: '01090001', name: 'Quang Trung'},
                    {id: '02090001', name: 'Nguyễn Trãi'},
                    {id: '03090001', name: 'Hà Cầu'},
                    {id: '04090001', name: 'Vạn Phúc'},
                    {id: '06090001', name: 'Phúc la'},
                    {id: '07090001', name: 'Yết Kiêu'},
                    {id: '08090001', name: 'Mộ Lao'},
                    {id: '09090001', name: 'Văn Quán'},
                ]},
            {id: '100001', name: 'Quận Long Biên', ward: [
                    {id: '01100001', name: 'Bồ Đề'},
                    {id: '02100001', name: 'Gia Thụy'},
                    {id: '03100001', name: 'Cự Khối'},
                    {id: '04100001', name: 'Đức Giang'},
                    {id: '06100001', name: 'Giang Biên'},
                    {id: '07100001', name: 'Long Biên'},
                    {id: '08100001', name: 'Ngọc Lâm'},
                    {id: '09100001', name: 'Ngọc Thụy'},
                ]},
            {id: '110001', name: 'Quận Nam Từ Liêm', ward: [
                    {id: '01110001', name: 'Cầu Diễn'},
                    {id: '02110001', name: 'Đại Mỗ'},
                    {id: '03110001', name: 'Mễ Trì'},
                    {id: '04110001', name: 'Mỹ Đình 1'},
                    {id: '06110001', name: 'Mỹ Đình 2'},
                    {id: '07110001', name: 'Phú Đô'},
                    {id: '08110001', name: 'Phương Canh'},
                    {id: '09110001', name: 'Tây Mỗ'},
                ]},
            {id: '120001', name: 'Quận Thanh Xuân', ward: [
                    {id: '01120001', name: 'Hạ Đình'},
                    {id: '02120001', name: 'Kim Giang'},
                    {id: '03120001', name: 'Khương Đình'},
                    {id: '04120001', name: 'Khương Mai'},
                    {id: '06120001', name: 'Khương Trung'},
                    {id: '07120001', name: 'Nhân Chính'},
                    {id: '08120001', name: 'Phương Liệt'},
                    {id: '09120001', name: 'Thanh Xuân Bắc'},
                ]},
            {id: '130001', name: 'Quận Tây Hồ', ward: [
                    {id: '01130001', name: 'Bưởi'},
                    {id: '02130001', name: 'Thụy Khuê'},
                    {id: '03130001', name: 'Yên Phụ'},
                    {id: '04130001', name: 'Tứ Liên'},
                    {id: '06130001', name: 'Nhật Tân'},
                    {id: '07130001', name: 'Quảng An'},
                    {id: '08130001', name: 'Xuân La'},
                    {id: '09130001', name: 'Phú Thượng'},
                ]},
        ]},
    {id: '0002', name:'Hồ Chí Minh', district: [
            {id: '010001', name: 'Quận Ba Đình' , ward: [
                    {id: '01010001', name: 'Cống Vị'},
                    {id: '02010001', name: 'Điện Biên'},
                    {id: '03010001', name: 'Đội Cấn'},
                    {id: '04010001', name: 'Giảng Võ'},
                    {id: '06010001', name: 'Kim Mã'},
                    {id: '07010001', name: 'Liễu Giai'},
                    {id: '08010001', name: 'Ngọc Hà'},
                    {id: '09010001', name: 'Ngọc Khánh'},
                ]},
            {id: '020001', name: 'Quận Bắc Từ Liêm', ward: [
                    {id: '01020001', name: 'Cổ Nhuế 1'},
                    {id: '02020001', name: 'Cổ Nhuế 2'},
                    {id: '03020001', name: 'Đông Ngạc'},
                    {id: '04020001', name: 'Đức Thắng'},
                    {id: '06020001', name: 'Liên Mạc'},
                    {id: '07020001', name: 'Minh Khai'},
                    {id: '08020001', name: 'Phú Diễn'},
                    {id: '09020001', name: 'Phúc Diễn'},
                ]},
            {id: '030001', name: 'Quận Cầu Giấy', ward: [
                    {id: '01030001', name: 'Nghĩa Đô'},
                    {id: '02030001', name: 'Quan Hoa'},
                    {id: '03030001', name: 'Dịch Vọng Hậu'},
                    {id: '04030001', name: 'Trung Hòa'},
                    {id: '06030001', name: 'Nghĩa Tân'},
                    {id: '07030001', name: 'Mai Dịch'},
                    {id: '08030001', name: 'Yên Hòa'},
                ]},
            {id: '040001', name: 'Quận Đống Đa', ward: [
                    {id: '01040001', name: 'Văn Miếu'},
                    {id: '02040001', name: 'Quốc Tử Giám'},
                    {id: '03040001', name: 'Hàng Bột'},
                    {id: '04040001', name: 'Nam Đồng'},
                    {id: '06040001', name: 'Trung Liệt'},
                    {id: '07040001', name: 'Khâm Thiên'},
                    {id: '08040001', name: 'Phương Liên'},
                    {id: '09040001', name: 'Phương Mai'},
                ]},
            {id: '050001', name: 'Quận Hà Đông', ward: [
                    {id: '01050001', name: 'Quang Trung'},
                    {id: '02050001', name: 'Nguyễn Trãi'},
                    {id: '03050001', name: 'Hà Cầu'},
                    {id: '04050001', name: 'Vạn Phúc'},
                    {id: '06050001', name: 'Phúc La'},
                    {id: '07050001', name: 'Yết Kiêu'},
                    {id: '08050001', name: 'Mộ Lao'},
                    {id: '09050001', name: 'Văn Quán'},
                ]},
            {id: '060001', name: 'Quận Hai Bà Trưng', ward: [
                    {id: '01060001', name: 'Quang Trung'},
                    {id: '02060001', name: 'Nguyễn Trãi'},
                    {id: '03060001', name: 'Hà Cầu'},
                    {id: '04060001', name: 'Vạn Phúc'},
                    {id: '06060001', name: 'Phúc La'},
                    {id: '07060001', name: 'Yết Kiêu'},
                    {id: '08060001', name: 'Mộ Lao'},
                    {id: '09060001', name: 'Văn Quán'},
                ]},
            {id: '070001', name: 'Quận Hoàn Kiếm', ward: [
                    {id: '01070001', name: 'Chương Dương Độ'},
                    {id: '02070001', name: 'Cửa Đông'},
                    {id: '03070001', name: 'Cửa Nam'},
                    {id: '04070001', name: 'Đòng Xuân'},
                    {id: '06070001', name: 'Hàng Bạc'},
                    {id: '07070001', name: 'Hàng Bài'},
                    {id: '08070001', name: 'Hàng Bồ'},
                    {id: '09070001', name: 'Hàng Bông'},
                ]},
            {id: '080001', name: 'Quận Hoàng Mai', ward: [
                    {id: '01080001', name: 'Định Công'},
                    {id: '02080001', name: 'Đại Kim'},
                    {id: '03080001', name: 'Giáp Bát'},
                    {id: '04080001', name: 'Đại Liệt'},
                    {id: '06080001', name: 'Hoàng Văn Thụ'},
                    {id: '07080001', name: 'Lĩnh Nam'},
                    {id: '08080001', name: 'Mai Động'},
                    {id: '09080001', name: 'Tân Mai'},
                ]},
            {id: '090001', name: 'Quận Hà Đông', ward: [
                    {id: '01090001', name: 'Quang Trung'},
                    {id: '02090001', name: 'Nguyễn Trãi'},
                    {id: '03090001', name: 'Hà Cầu'},
                    {id: '04090001', name: 'Vạn Phúc'},
                    {id: '06090001', name: 'Phúc la'},
                    {id: '07090001', name: 'Yết Kiêu'},
                    {id: '08090001', name: 'Mộ Lao'},
                    {id: '09090001', name: 'Văn Quán'},
                ]},
            {id: '100001', name: 'Quận Long Biên', ward: [
                    {id: '01100001', name: 'Bồ Đề'},
                    {id: '02100001', name: 'Gia Thụy'},
                    {id: '03100001', name: 'Cự Khối'},
                    {id: '04100001', name: 'Đức Giang'},
                    {id: '06100001', name: 'Giang Biên'},
                    {id: '07100001', name: 'Long Biên'},
                    {id: '08100001', name: 'Ngọc Lâm'},
                    {id: '09100001', name: 'Ngọc Thụy'},
                ]},
            {id: '110001', name: 'Quận Nam Từ Liêm', ward: [
                    {id: '01110001', name: 'Cầu Diễn'},
                    {id: '02110001', name: 'Đại Mỗ'},
                    {id: '03110001', name: 'Mễ Trì'},
                    {id: '04110001', name: 'Mỹ Đình 1'},
                    {id: '06110001', name: 'Mỹ Đình 2'},
                    {id: '07110001', name: 'Phú Đô'},
                    {id: '08110001', name: 'Phương Canh'},
                    {id: '09110001', name: 'Tây Mỗ'},
                ]},
            {id: '120001', name: 'Quận Thanh Xuân', ward: [
                    {id: '01120001', name: 'Hạ Đình'},
                    {id: '02120001', name: 'Kim Giang'},
                    {id: '03120001', name: 'Khương Đình'},
                    {id: '04120001', name: 'Khương Mai'},
                    {id: '06120001', name: 'Khương Trung'},
                    {id: '07120001', name: 'Nhân Chính'},
                    {id: '08120001', name: 'Phương Liệt'},
                    {id: '09120001', name: 'Thanh Xuân Bắc'},
                ]},
            {id: '130001', name: 'Quận Tây Hồ', ward: [
                    {id: '01130001', name: 'Bưởi'},
                    {id: '02130001', name: 'Thụy Khuê'},
                    {id: '03130001', name: 'Yên Phụ'},
                    {id: '04130001', name: 'Tứ Liên'},
                    {id: '06130001', name: 'Nhật Tân'},
                    {id: '07130001', name: 'Quảng An'},
                    {id: '08130001', name: 'Xuân La'},
                    {id: '09130001', name: 'Phú Thượng'},
                ]},
        ]},
    {id: '0003', name:'An Giang', district: [
            {id: '010001', name: 'Quận Ba Đình' , ward: [
                    {id: '01010001', name: 'Cống Vị'},
                    {id: '02010001', name: 'Điện Biên'},
                    {id: '03010001', name: 'Đội Cấn'},
                    {id: '04010001', name: 'Giảng Võ'},
                    {id: '06010001', name: 'Kim Mã'},
                    {id: '07010001', name: 'Liễu Giai'},
                    {id: '08010001', name: 'Ngọc Hà'},
                    {id: '09010001', name: 'Ngọc Khánh'},
                ]},
            {id: '020001', name: 'Quận Bắc Từ Liêm', ward: [
                    {id: '01020001', name: 'Cổ Nhuế 1'},
                    {id: '02020001', name: 'Cổ Nhuế 2'},
                    {id: '03020001', name: 'Đông Ngạc'},
                    {id: '04020001', name: 'Đức Thắng'},
                    {id: '06020001', name: 'Liên Mạc'},
                    {id: '07020001', name: 'Minh Khai'},
                    {id: '08020001', name: 'Phú Diễn'},
                    {id: '09020001', name: 'Phúc Diễn'},
                ]},
            {id: '030001', name: 'Quận Cầu Giấy', ward: [
                    {id: '01030001', name: 'Nghĩa Đô'},
                    {id: '02030001', name: 'Quan Hoa'},
                    {id: '03030001', name: 'Dịch Vọng Hậu'},
                    {id: '04030001', name: 'Trung Hòa'},
                    {id: '06030001', name: 'Nghĩa Tân'},
                    {id: '07030001', name: 'Mai Dịch'},
                    {id: '08030001', name: 'Yên Hòa'},
                ]},
            {id: '040001', name: 'Quận Đống Đa', ward: [
                    {id: '01040001', name: 'Văn Miếu'},
                    {id: '02040001', name: 'Quốc Tử Giám'},
                    {id: '03040001', name: 'Hàng Bột'},
                    {id: '04040001', name: 'Nam Đồng'},
                    {id: '06040001', name: 'Trung Liệt'},
                    {id: '07040001', name: 'Khâm Thiên'},
                    {id: '08040001', name: 'Phương Liên'},
                    {id: '09040001', name: 'Phương Mai'},
                ]},
            {id: '050001', name: 'Quận Hà Đông', ward: [
                    {id: '01050001', name: 'Quang Trung'},
                    {id: '02050001', name: 'Nguyễn Trãi'},
                    {id: '03050001', name: 'Hà Cầu'},
                    {id: '04050001', name: 'Vạn Phúc'},
                    {id: '06050001', name: 'Phúc La'},
                    {id: '07050001', name: 'Yết Kiêu'},
                    {id: '08050001', name: 'Mộ Lao'},
                    {id: '09050001', name: 'Văn Quán'},
                ]},
            {id: '060001', name: 'Quận Hai Bà Trưng', ward: [
                    {id: '01060001', name: 'Quang Trung'},
                    {id: '02060001', name: 'Nguyễn Trãi'},
                    {id: '03060001', name: 'Hà Cầu'},
                    {id: '04060001', name: 'Vạn Phúc'},
                    {id: '06060001', name: 'Phúc La'},
                    {id: '07060001', name: 'Yết Kiêu'},
                    {id: '08060001', name: 'Mộ Lao'},
                    {id: '09060001', name: 'Văn Quán'},
                ]},
            {id: '070001', name: 'Quận Hoàn Kiếm', ward: [
                    {id: '01070001', name: 'Chương Dương Độ'},
                    {id: '02070001', name: 'Cửa Đông'},
                    {id: '03070001', name: 'Cửa Nam'},
                    {id: '04070001', name: 'Đòng Xuân'},
                    {id: '06070001', name: 'Hàng Bạc'},
                    {id: '07070001', name: 'Hàng Bài'},
                    {id: '08070001', name: 'Hàng Bồ'},
                    {id: '09070001', name: 'Hàng Bông'},
                ]},
            {id: '080001', name: 'Quận Hoàng Mai', ward: [
                    {id: '01080001', name: 'Định Công'},
                    {id: '02080001', name: 'Đại Kim'},
                    {id: '03080001', name: 'Giáp Bát'},
                    {id: '04080001', name: 'Đại Liệt'},
                    {id: '06080001', name: 'Hoàng Văn Thụ'},
                    {id: '07080001', name: 'Lĩnh Nam'},
                    {id: '08080001', name: 'Mai Động'},
                    {id: '09080001', name: 'Tân Mai'},
                ]},
            {id: '090001', name: 'Quận Hà Đông', ward: [
                    {id: '01090001', name: 'Quang Trung'},
                    {id: '02090001', name: 'Nguyễn Trãi'},
                    {id: '03090001', name: 'Hà Cầu'},
                    {id: '04090001', name: 'Vạn Phúc'},
                    {id: '06090001', name: 'Phúc la'},
                    {id: '07090001', name: 'Yết Kiêu'},
                    {id: '08090001', name: 'Mộ Lao'},
                    {id: '09090001', name: 'Văn Quán'},
                ]},
            {id: '100001', name: 'Quận Long Biên', ward: [
                    {id: '01100001', name: 'Bồ Đề'},
                    {id: '02100001', name: 'Gia Thụy'},
                    {id: '03100001', name: 'Cự Khối'},
                    {id: '04100001', name: 'Đức Giang'},
                    {id: '06100001', name: 'Giang Biên'},
                    {id: '07100001', name: 'Long Biên'},
                    {id: '08100001', name: 'Ngọc Lâm'},
                    {id: '09100001', name: 'Ngọc Thụy'},
                ]},
            {id: '110001', name: 'Quận Nam Từ Liêm', ward: [
                    {id: '01110001', name: 'Cầu Diễn'},
                    {id: '02110001', name: 'Đại Mỗ'},
                    {id: '03110001', name: 'Mễ Trì'},
                    {id: '04110001', name: 'Mỹ Đình 1'},
                    {id: '06110001', name: 'Mỹ Đình 2'},
                    {id: '07110001', name: 'Phú Đô'},
                    {id: '08110001', name: 'Phương Canh'},
                    {id: '09110001', name: 'Tây Mỗ'},
                ]},
            {id: '120001', name: 'Quận Thanh Xuân', ward: [
                    {id: '01120001', name: 'Hạ Đình'},
                    {id: '02120001', name: 'Kim Giang'},
                    {id: '03120001', name: 'Khương Đình'},
                    {id: '04120001', name: 'Khương Mai'},
                    {id: '06120001', name: 'Khương Trung'},
                    {id: '07120001', name: 'Nhân Chính'},
                    {id: '08120001', name: 'Phương Liệt'},
                    {id: '09120001', name: 'Thanh Xuân Bắc'},
                ]},
            {id: '130001', name: 'Quận Tây Hồ', ward: [
                    {id: '01130001', name: 'Bưởi'},
                    {id: '02130001', name: 'Thụy Khuê'},
                    {id: '03130001', name: 'Yên Phụ'},
                    {id: '04130001', name: 'Tứ Liên'},
                    {id: '06130001', name: 'Nhật Tân'},
                    {id: '07130001', name: 'Quảng An'},
                    {id: '08130001', name: 'Xuân La'},
                    {id: '09130001', name: 'Phú Thượng'},
                ]},
        ]},
]

const SelectAddress = ({route, navigation}) => {

    const {name, city, district, lastScreen} = route.params
    const [data, setData] = useState([])

    useEffect(() =>{
        if(name === 'Tỉnh/Thành Phố'){
            setData(addressList)
        }
        if(name === 'Quận/Huyện'){
                const resultFind = addressList.find(item => item.name === city);
                setData(resultFind.district)
        }
        if(name === 'Phường/Xã'){
                const resultCity = addressList.find(item => item.name === city);
                const resultDistrict = resultCity.district.find(item => item.name === district);
                setData(resultDistrict.ward)
        }
    },[name])

    return (
        <View style={styles.container}>
            <FlatList style={{marginHorizontal: 15}}
                      data={data}
                      renderItem =
                          {
                              ({item, index}) =>
                                  <TouchableOpacity style={styles.item}
                                  onPress={()=> navigation.navigate(lastScreen, { name: item.name, type: name })}>
                                      <Text styles={styles.text}>{item.name}</Text>
                                  </TouchableOpacity>
                          }
                      keyExtractor={item => item.id}
                      showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    item: {
        borderBottomWidth: 0.5,
        borderColor: '#DADADA',
        height: 60,
        justifyContent: 'center',
    },
    text: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 21,
    },

});

export default SelectAddress;
