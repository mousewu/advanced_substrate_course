import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  const fetchKittyCnt = () => {
    let unsubscribe;
    // 读取毛孩数量的方法，通过 useEffect 可以绑定，当发生变化的时候，会自动更新
    // kittiesCount 是整数，直接使用
    // 如果定义是 Option 的类型，还需要 unwrap 以及需要判断是否是 None
    api.query.kittiesModule.kittiesCount(kCount => {
      setKittyCnt(kCount.toNumber());
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);
    return () => unsubscribe && unsubscribe();
  };

  const fetchKitties = () => {
    if( kittyCnt == 0 ) return;

    let unsubscribe;
    let _ids = [];
    for (var _i = 0; _i < kittyCnt; _i++) { _ids[_ids.length] = _i; }
    api.query.kittiesModule.kitties.multi(_ids, _kitties => {
      let kitties = [];
      _kitties.map((item, index) => { kitties[kitties.length] = {id: index, dna: item.unwrap(), is_owner:false} });
      setKitties(kitties);
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);
    return () => unsubscribe && unsubscribe();
  };
  const fetchKittyOwners = () => {
    if( kittyCnt == 0 ) return;

    let unsubscribe;
    let _ids = [];
    for (var _i = 0; _i < kittyCnt; _i++) { _ids[_ids.length] = _i; }
    api.query.kittiesModule.kittyOwners.multi(_ids, _owners => {
      let owners = {};
      _owners.map((item, index) => { owners[index] = item.unwrap().toString(); });
      setKittyOwners(owners);
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);
    return () => unsubscribe && unsubscribe();
  };

  const fetchKittyPrices = () => {
    if( kittyCnt == 0 ) return;

    let unsubscribe;
    let _ids = [];
    for (var _i = 0; _i < kittyCnt; _i++) { _ids[_ids.length] = _i; }
    api.query.kittiesModule.kittyPrices.multi(_ids, _prices => {
      let prices = {};
      _prices.map((item, index) => { prices[index] = item.isNone?0:item.unwrap().toNumber(); });
      setKittyPrices(prices);
      console.log(prices);
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);
    return () => unsubscribe && unsubscribe();
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt, kittyOwners, accountPair]);
  useEffect(fetchKittyOwners, [api, kittyCnt, accountPair]);
  useEffect(fetchKittyPrices, [api, kittyCnt, accountPair]);
  // useEffect(populateKitties, [kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>{kittyCnt}个小毛孩</h1>
    <KittyCards kitties={kitties} kittyOwners={kittyOwners} kittyPrices={kittyPrices} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
