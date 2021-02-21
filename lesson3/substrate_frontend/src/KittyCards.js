import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from './substrate-lib/components';

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  // 设置转让接受人的地址
  const formChange = key => (ev, el) => {
    // 修改 key 的值，prev 是引用的先前的值，...prev 表示其余的值保持不变
    setFormValue(prev => ({ ...prev, [key]: el.value }));
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>转让</Button>}>
    <Modal.Header>毛孩转让</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange('target')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kittiesModule',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.id],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

const SetpriceModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  // 设置转让接受人的地址
  const formChange = key => (ev, el) => {
    // 修改 key 的值，prev 是引用的先前的值，...prev 表示其余的值保持不变
    setFormValue(prev => ({ ...prev, [key]: el.value }));
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>定价</Button>}>
    <Modal.Header>毛孩价格设置</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='价格' placeholder='售卖价格' value={kitty.prie} onChange={formChange('price')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认价格' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kittiesModule',
          callable: 'ask',
          inputParams: [kitty.id, formValue.price],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

const BuyModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>购买</Button>}>
    <Modal.Header>购买毛孩</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='价格' readOnly value={kitty.price}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认购买' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kittiesModule',
          callable: 'buy',
          inputParams: [kitty.id, kitty.price],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};


// --- About Kitty Card ---

const KittyCard = props => {
  const {kitty, owner, price, accountPair, setStatus} = props;

  const cardCss = {
    wordBreak:"break-all",
    width:"275px",
    margin:"5px",
  };
  const selfColor = {
    color:"gray",
  };

  let isSelf = '';
  if( owner == accountPair.address){
    kitty.is_owner = true;
  }
  kitty.price = price;

  return <Card style={cardCss}>
              <Card.Content>
                  <Card.Header>ID {kitty.id}</Card.Header>
                  <KittyAvatar dna={kitty.dna} />
                  <Card.Description>
                    <b>编号: </b>{kitty.id}<br />
                    <b>基因: </b>{kitty.dna.join(',')}<br />
                    <b>主人: </b>{kitty.is_owner? <span style={selfColor}>(我自己的)</span> : owner}<br />
                    <b>价格: </b>{kitty.price}<br />
                  </Card.Description>
                  { kitty.is_owner && 
                     <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
                  }
                  { kitty.is_owner && 
                     <SetpriceModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
                  }

                  { !kitty.is_owner && kitty.price &&
                     <BuyModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
                  }
              </Card.Content>
          </Card>;
};

const KittyCards = props => {
  const { kitties, kittyOwners, kittyPrices, accountPair, setStatus } = props;
  const gridCss = {
    margin:"5px",
  };

  return <Grid columns='equal'><Grid.Row stretched>
    {
      kitties.map((kitty, index) => {
        return <Grid.Row key={index}><KittyCard kitty={kitty} owner={kittyOwners[index]} price={kittyPrices[index]} accountPair={accountPair} setStatus={setStatus} /></Grid.Row>
      })
    }
    </Grid.Row>
  </Grid>;
};

export default KittyCards;
