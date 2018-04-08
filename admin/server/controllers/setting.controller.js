import Setting from '../models/setting';

export function createSetting(req, res) {
  const reqSetting = req.body.setting;
  if (reqSetting &&
      reqSetting.hasOwnProperty('name') &&
      reqSetting.hasOwnProperty('value')
  ) {
    const setting = new Setting({
      name: reqSetting.name,
      nameSort: reqSetting.name.toLowerCase(),
      value: reqSetting.value,
    });
    setting.save((err) => {
      if (err) {
        res.json({ setting: 'Lỗi tạo cấu hình' });
      } else {
        res.json({ setting: 'Tạo cấu hình thành công.' });
      }
    });
  } else {
    res.json({ setting: 'Thiếu thông tin.' });
  }
}
export function updateSetting(req, res) {
  const reqSetting = req.body.setting;
  if (reqSetting &&
      reqSetting.hasOwnProperty('name') &&
      reqSetting.hasOwnProperty('value')
  ) {
    Setting.findOneAndUpdate(
      { _id: reqSetting._id },
      {
        value: reqSetting.value,
        name: reqSetting.name,
        disabled: reqSetting.disabled,
      }
    ).exec((err) => {
      if (err) {
        res.json({ setting: 'Lỗi chỉnh sửa.' });
      } else {
        res.json({ setting: 'Chỉnh sửa thành công.' });
      }
    });
  } else {
    res.json({ setting: 'Thiếu thông tin.' });
  }
}

export function getSetting(req, res) {
  const page = req.query.page;
  Setting.find({}, {}, { skip: 10 * Number(page), limit: 10, sort: { nameSort: 1 } }).exec((err, settings) => {
    if (err) {
      res.json({ setting: [] });
    } else {
      res.json({ setting: settings });
    }
  });
}
