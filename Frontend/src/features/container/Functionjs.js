export const funLine = () => {
  var $ = document.querySelector.bind(document);

  var tabActive = $(".item.active");
  var line = $(".line_slide");

  if (line && tabActive) {
    line.style.left = tabActive.offsetLeft + "px";
    line.style.width = tabActive.offsetWidth + "px";
  }
};
export const lineSlide = () => {
  var $ = document.querySelector.bind(document);
  var $$ = document.querySelectorAll.bind(document);
  var line = $(".line_slide");
  if (line) {
    var tabItem = $$(".item");
    tabItem.forEach((tab, index) => {
      tab.onclick = function () {
        $(".item.active")?.classList?.remove("active");
        line.style.width = this.offsetWidth + "px";
        line.style.left = this.offsetLeft + "px";
        this.classList.add("active");
      };
    });
  }
};
export const checkBar = (bar_ref, nav_ref, line_ref) => {
  var widthScreen = window.innerWidth;
  const bar = bar_ref;
  const nav = nav_ref;
  const line = line_ref;
  if (bar && nav && line) {
    if (widthScreen <= 800) {
      nav.classList.add("menu--hident");
      bar.style.display = "flex";
      line.style.display = "none";
    } else {
      nav.classList.remove("menu--hident");
      bar.style.display = "none";
      line.style.display = "block";
    }
  }
};
export const openMenu = (bar_ref) => {
  const bar = bar_ref;
  if (bar) {
    const $ = document.querySelector.bind(document);
    bar.onclick = () => {
      if ($(".bar.menu__bar")) {
        $(".bar.menu__bar").classList.remove("menu__bar");
        $(".bar").classList.add("menu__barClose");
        $(".menu--hident").style.right = "-16px";
        // $(".menu--hident").style.opacity = "1";
      } else {
        $(".bar.menu__barClose").classList.remove("menu__barClose");
        $(".bar").classList.add("menu__bar");
        $(".menu--hident").style.right = "100%";
        // $(".menu--hident").style.opacity = "0";
      }
    };
  }
};
export const checkDate = (e) => {
  if (e) {
    // var ngay = e.substr(8, 2);
    var thang = e.substr(5, 2);
    var nam = e.substr(0, 4);
    return "Th??ng " + thang + ", " + nam;
  }
};
export const checkDateCompany = (e) => {
  if (e) {
    // var ngay = e.substr(8, 2);
    var thang = e.substr(5, 2);
    var nam = e.substr(0, 4);
    return "Th??ng " + thang + "/" + nam;
  }
};
export const formatDateWork = (e) => {
  if (e) {
    var ngay = e.substr(8, 2);
    var thang = e.substr(5, 2);
    var nam = e.substr(0, 4);
    return ngay + "/" + thang + "/" + nam;
  }
};
export const checkDateDealtime = (e) => {
  if (e) {
    const today = new Date();
    if (new Date(e) > today) {
      return "Ch??a h???t h???n";
    } else {
      return "???? h???t h???n";
    }
  }
};
export const checkArrayEquar = (a, b) => {
  if (a.length !== b.length) {
    return false;
  } else {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
};
export const checkStatus = (e) => {
  if (e) {
    let data = [];
    let a = e.rows;
    for (let i = 0; i < a.length; i++) {
      if (a[i].status === 0) {
        data.push(a[i]);
      }
    }
    console.log(data);
    return data;
  }
};
export const GetCategoryHome = (e) => {
  let list = e.rows;
  if (list.length !== 0) {
    let data = [];
    let result = [];
    for (let i = 0; i < list.length; i++) {
      data.push({
        id: list[i].id,
        name: list[i].name,
        icon: list[i].icon,
        length: list[i]?.Works?.length,
      });
    }
    data.sort((a, b) => {
      return b.length - a.length;
    });
    for (let i = 0; i < data.length; i++) {
      if (result.length < 8) {
        result.push(data[i]);
      }
    }
    return result;
  }
};
export const FormatProvince = (e) => {
  if (e) {
    if (e.search("Th??nh ph???") !== -1) {
      return e.substr(10);
    } else {
      return e.substr(5);
    }
  }
};
export const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1].split("%20").join(" ");
    }
  }
  return false;
};
export const removeVietnameseTones = (str) => {
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
  str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
  str = str.replace(/??|??|???|???|??/g, "i");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
  str = str.replace(/???|??|???|???|???/g, "y");
  str = str.replace(/??/g, "d");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
  str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
  str = str.replace(/??|??|???|???|??/g, "I");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
  str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
  str = str.replace(/???|??|???|???|???/g, "Y");
  str = str.replace(/??/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
  // Remove extra spaces
  // B??? c??c kho???ng tr???ng li???n nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // B??? d???u c??u, k?? t??? ?????c bi???t
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " ",
  );
  return str;
};
