import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Loading,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

// import { Container } from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    // navigation vem no props.navigation
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    refreshing: true,
    page: 1,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;
    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({ stars: response.data, refreshing: false, page: page + 1 });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const { page, stars } = this.state;
    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });
    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      refreshing: false,
      page: page + 1,
    });
  };

  refreshList = () => {
    this.setState(
      {
        stars: [],
        refreshing: true,
        page: 1,
      },
      this.loadMore
    );
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing } = this.state;

    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {refreshing ? (
          <Loading>
            <ActivityIndicator size="large" color="#7159c1" />
          </Loading>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
            onEndReachedThreshold={0.5} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
          />
        )}
      </Container>
    );
  }
}
