package com.fem.google.cloud.endpoints;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

@Api(name = "userendpoint")
public class UserEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	public CollectionResponse<User> listUser(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<User> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(User.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<User>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (User obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<User> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	public User getUser(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		User user = null;
		try {
			user = mgr.getObjectById(User.class, id);
		} finally {
			mgr.close();
		}
		return user;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param user the entity to be inserted.
	 * @return The inserted entity.
	 */
	public User insertUser(User user) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (containsUser(user)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.makePersistent(user);
		} finally {
			mgr.close();
		}
		return user;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param user the entity to be updated.
	 * @return The updated entity.
	 */
	public User updateUser(User user) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsUser(user)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(user);
		} finally {
			mgr.close();
		}
		return user;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @return The deleted entity.
	 */
	public User removeUser(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		User user = null;
		try {
			user = mgr.getObjectById(User.class, id);
			mgr.deletePersistent(user);
		} finally {
			mgr.close();
		}
		return user;
	}

	private boolean containsUser(User user) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(User.class, user.getUserId());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}
	
	
	/***************** Automatic code generation end  ***************/
	
	
	/***************** Custom endpoint methods start ****************/
	
	
	/**
	 * This method is supposed to retrieve all the groups of a user with id.
	 * @param id UserId of the user whose groups to be fetched
	 * */
	@ApiMethod(
 			httpMethod = "GET", 
 			name = "user.groups",
			path="user/{id}/group"
			)
	public List<Group> getGroups(@Named("id") String id) {
		
		List<Group> alGroups = new ArrayList<Group>();
		Group objGroup = new Group();
		objGroup.setGroupName("Test Group for list");
		alGroups.add(objGroup);
		return alGroups;
	}
	
	/**
	 * This method is supposed to retrieve group information of specific group.
	 * @param userId UserId of the user whose groups to be fetched
	 * @param groupId Group id of which information is to be fetched.
	 * */
	@ApiMethod(
 			httpMethod = "GET", 
 			name = "user.groups.group",
			path="user/{userId}/group/{groupId}"
			)
	public Group getGroup(@Named("userId") String userId, @Named("groupId") String groupId) {
		Group objGroup = new Group();
		
		objGroup.setGroupName("Test in getting only one group as per id provided");
		objGroup.setGroupId(groupId);
		
		return objGroup;
	}
	
	
	
	
	/**
	 * Test method which shows what will be protocol for implementing search method
	 * */
	@ApiMethod(
		      httpMethod = "GET", 
		      name = "user.search",
		      path = "user/search/{queryString}")
		  public List<User> search(@Named("queryString") String queryString) 
		      throws Exception {
		   /* if (guser == null) {
		      throw new UnauthorizedException(CustomErrors.MUST_LOG_IN.toString());
		    }
		    */
		    List<User> returnList = new ArrayList<User>();
		    /*Results<ScoredDocument> searchResults = INDEX.search(queryString);

		    for (ScoredDocument scoredDoc : searchResults) {
		      Field fieldId = scoredDoc.getOnlyField("id");
		      if (fieldId == null || fieldId.getText() == null)
		        continue;

		      long userId = Long.parseLong(fieldId.getText());
		      if (userId != -1) {
		        User p = getUser(userId, guser);
		        returnList.add(p);
		      }
		    }*/
		    return returnList;
		  }
	
	
	
	

}