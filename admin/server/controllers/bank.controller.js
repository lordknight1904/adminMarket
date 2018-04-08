import Bank from '../models/bank';

export function getBank(req, res) {
  Bank.find({}).exec((err, banks) => {
    if (err) {
      res.json({ banks: [] });
    } else {
      res.json({ banks });
    }
  })
}
export function createBank(req, res) {
  const reqBank = req.body.bank;
  if (reqBank && reqBank.hasOwnProperty('name')) {
    const bank = new Bank({
      name: reqBank.name,
    });
    bank.save((err) => {
      if (err) {
        console.log(err);
        res.json({ bank: 'error' });
      } else {
        res.json({ bank: 'Thêm ngân hàng thành công' });
      }
    })
  } else {
    res.json({ bank: 'missing' });
  }
}
export function updateBank(req, res) {
  const reqBank = req.body.bank;
  if (reqBank && reqBank.hasOwnProperty('id') && reqBank.hasOwnProperty('name')) {
    Bank.findOneAndUpdate({ _id: reqBank.id }, { name: reqBank.name }, { new: true }).exec((err, bank) => {
      if (err) {
        res.json({ bank: 'error' });
      } else {
        res.json({ bank: 'Chỉnh sửa thành công' });
      }
    })
  } else {
    res.json({ bank: 'missing' });
  }
}
