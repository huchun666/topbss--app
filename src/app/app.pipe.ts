import { PipeTransform, Pipe, transition } from '@angular/core';

// 订单状态的转换
// pass:通过，字体颜色为绿  audit：字体为红色 (根据状态为其显示添加css)
@Pipe({ name: 'setOrderStatus' })
export class FilterStatusPipe implements PipeTransform {
  transform(param: string): any {
    switch(param) {
      case "0":
        return {
          status: "待支付",
          pass: false,
          audit: true
        };
      case "1":
        return {
          status: "已支付",
          pass: true,
          audit: false
        };
      case "2":
        return {
          status: "已发货",
          pass: true,
          audit: false
        };
      case "3":
        return {
          status: "已收货",
          pass: true,
          audit: false
        };
      case "4":
        return {
          status: "已取消",
          pass: false,
          audit: true
        };
      case "6":
        return {
          status: "取消中",
          pass: true,
          audit: false
        };
      case "C":
        return {
          status: "已完成",
          pass: true,
          audit: false
        }
    }
  }
}

// 退货订单的状态转换
// pass:通过，字体颜色为绿  audit：字体为红色 (根据状态为其显示添加css)
@Pipe({ name: 'setReturnOrderStatus' })
export class FilterReturnStatusPipe implements PipeTransform {
  transform(param: string): any {
    switch(param) {
      case "0":
        return {
          status: "申请审核中",
          pass: false,
          audit: true
        };
      case "1":
        return {
          status: "申请已同意",
          pass: true,
          audit: false
        };
      case "2":
        return {
          status: "商家已收货",
          pass: true,
          audit: false
        };
      case "3":
        return {
          status: "申请已完成",
          pass: true,
          audit: false
        };
      case "4":
        return {
          status: "申请拒绝",
          pass: false,
          audit: true
        };
    }
  }
}

// 取消订单的状态转换
// pass:通过，字体颜色为绿  audit：字体为红色 (根据状态为其显示添加css)
@Pipe({ name: 'setCancelOrderStatus' })
export class FilterCancelStatusPipe implements PipeTransform {
  transform(param: string): any {
    let value = "";
    switch(param) {
      case "0":
        return {
          status: "申请审核中",
          pass: false,
          audit: true
        }
      case "1":
        return {
          status: "申请已通过",
          pass: true,
          audit: false
        }
      case "2":
        return {
          status: "申请已拒绝",
          pass: false,
          audit: true
        }
      case "3":
        return {
          status: "退款已完成",
          pass: true,
          audit: false
        }
    }
  }
}
// 提现明细
@Pipe({ name: 'setWithdrawStatus' })
export class FilterWithdrawStatusPipe implements PipeTransform {
  transform(param: string): string {
    switch(param) {
      case "0":
        return "失败";
      case "1":
        return "成功";
      case "3":
        return "拒绝";
      case "9":
        return "处理中";
    }
  }
}

//未使用自提赠品列表状态
@Pipe({ name: 'setGiftType' })
export class FilterGiftTypePipe implements PipeTransform {
  transform(giftType: string, expoent: string): string {
    if (giftType=='0' && expoent=='2'){
      return "预约兑换";
    }else if (giftType=='0' && expoent=='3'){
      return "预约成功";
    }else if (giftType=='1') {
      return "到店兑换";
    }
  }
}

//已使用自提赠品列表状态
@Pipe({ name: 'setHandleGiftType' })
export class FilterHandleGiftTypePipe implements PipeTransform {
  transform(giftType: string): string {
    switch(giftType) {
      case "0":
        return "预约兑换";
      case "1":
        return "到店兑换";
    }
  }
}

//生成订单模块：sku初始加载，是否置灰
@Pipe({ name: 'isOrIsnotInvalidAttrValue' })
export class IsOrIsnotInvalidAttrValuePipe implements PipeTransform {
  transform(invalidAttrValue: any): any {
    return invalidAttrValue == "invalidAttrValue" ? "disabled" : false;
  }
}

//置灰样式
@Pipe({ name: 'invalidAttrValueClass' })
export class InvalidAttrValueClassPipe implements PipeTransform {
  transform(invalidAttrValueClass: any): Boolean {
    return invalidAttrValueClass == "invalidAttrValue" ? true : false;
  }
}

//生成订单模块：sku数量减少为1时的样式
@Pipe({ name: 'changeGray' })
export class ChangeGrayPipe implements PipeTransform {
  transform(count: number): Boolean {
    return count == 1 ? true : false;
  }
}

//图片加前缀或者没有图片时放补图
@Pipe({ name: 'productSkuDTOImage' })
export class ProductSkuDTOImagePipe implements PipeTransform {
  transform(productSkuDTOImage: string): string {
    return productSkuDTOImage ? "http://www.91topbaby.com/evercos/common/file/content/" + productSkuDTOImage : "../../assets/image/nodata.png";
  }
}
